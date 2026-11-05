import type { CommandEventConstructor, CommandEventLike } from "../types";

const listeners = new Map<HTMLButtonElement, EventListener>();

function resolveTarget(button: HTMLButtonElement): Element | null {
  const id = button.getAttribute("commandfor");

  if (!id) return null;

  const root = button.getRootNode() as Document | ShadowRoot;

  if (!("getElementById" in root)) return null;

  return root.getElementById(id);
}

function createCommandEvent(
  button: HTMLButtonElement,
  command: string,
): CommandEventLike {
  const view = button.ownerDocument.defaultView!;

  const CommandEventCtor = (
    view as unknown as {
      CommandEvent?: CommandEventConstructor;
    }
  ).CommandEvent;

  if (CommandEventCtor) {
    return new CommandEventCtor("command", {
      command,
      source: button,
      cancelable: true,
      composed: true,
    });
  }

  // Fallback for environments without CommandEvent.
  const event = new view.Event("command", {
    cancelable: true,
    composed: true,
  });

  Object.defineProperties(event, {
    command: { value: command },
    source: { value: button },
  });

  return event as CommandEventLike;
}

function executeCommand(button: HTMLButtonElement): void {
  if (button.matches(":disabled")) return;

  const command = button.getAttribute("command");
  const target = resolveTarget(button);

  if (!command || !target) return;

  const isCustomCommand = command.startsWith("--");
  const isDialogCommand = command === "show-modal" || command === "close";

  if (!isCustomCommand && !isDialogCommand) return;

  if (isDialogCommand && target.localName !== "dialog") return;

  const dialog = isDialogCommand ? (target as HTMLDialogElement) : null;

  if (command === "show-modal" && dialog?.open) return;
  if (command === "close" && !dialog?.open) return;

  const event = createCommandEvent(button, command);

  // A canceled command event prevents its default behavior.
  if (!target.dispatchEvent(event)) return;

  if (!dialog) return;

  switch (command) {
    case "show-modal":
      dialog.showModal();
      break;

    case "close":
      dialog.close();
      break;
  }
}

function addCommandListener(button: HTMLButtonElement): void {
  if (listeners.has(button)) return;

  const listener: EventListener = (event) => {
    // Wait until click propagation has completed so that a click
    // handler can still prevent the default activation.
    queueMicrotask(() => {
      if (event.defaultPrevented || !button.isConnected) return;

      executeCommand(button);
    });
  };

  listeners.set(button, listener);
  button.addEventListener("click", listener);
}

function removeCommandListener(button: HTMLButtonElement): void {
  const listener = listeners.get(button);

  if (!listener) return;

  button.removeEventListener("click", listener);
  listeners.delete(button);
}

function visitButtons(
  node: Node,
  callback: (button: HTMLButtonElement) => void,
): void {
  if (node.nodeType !== 1) return;

  const element = node as Element;

  if (element.localName === "button") {
    callback(element as HTMLButtonElement);
  }

  element.querySelectorAll("button").forEach((button) => {
    callback(button as HTMLButtonElement);
  });
}

function syncButton(button: HTMLButtonElement): void {
  if (button.hasAttribute("command")) {
    addCommandListener(button);
  } else {
    removeCommandListener(button);
  }
}

function syncTree(node: Node): void {
  visitButtons(node, syncButton);
}

function removeTreeListeners(node: Node): void {
  visitButtons(node, removeCommandListener);
}

export function installCommandInvokers(
  root: Document | ShadowRoot = document,
): () => void {
  const view =
    root.ownerDocument?.defaultView ?? (root as Document).defaultView;

  if (!view) return () => {};

  // Avoid duplicating native Invoker Commands behavior.
  if ("commandForElement" in view.HTMLButtonElement.prototype) {
    return () => {};
  }

  syncTree(root);

  const observer = new view.MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        syncButton(record.target as HTMLButtonElement);
        continue;
      }

      record.removedNodes.forEach(removeTreeListeners);
      record.addedNodes.forEach(syncTree);
    }
  });

  observer.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["command"],
  });

  return () => {
    observer.disconnect();
    removeTreeListeners(root);
  };
}
