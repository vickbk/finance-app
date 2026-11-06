import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { userClicks } from "@vickbk/tests/vitest/dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { installCommandInvokers } from "./command-invokers";

describe("command invokers", () => {
  let cleanupCommandInvokers: (() => void) | undefined;

  beforeEach(() => {
    cleanupCommandInvokers = installCommandInvokers();
  });

  afterEach(() => {
    cleanup();
    cleanupCommandInvokers?.();
    cleanupCommandInvokers = undefined;
  });

  it("tracks a dialog and opens it through its command invoker", async () => {
    render(
      <>
        <button type="button" command="show-modal" commandfor="test-dialog">
          Open dialog
        </button>

        <dialog id="test-dialog">
          <p>Dialog content</p>
        </dialog>
      </>,
    );

    const dialog = document.getElementById("test-dialog") as HTMLDialogElement;

    expect(dialog).not.toBeNull();
    expect(dialog.open).toBe(false);

    await userClicks("Open dialog");

    await waitFor(() => {
      expect(dialog.open).toBe(true);
    });
  });

  it("tracks dialogs rendered after initialization", async () => {
    const user = userEvent.setup();

    const { rerender } = render(<div />);

    rerender(
      <>
        <button type="button" command="show-modal" commandfor="late-dialog">
          Open late dialog
        </button>

        <dialog id="late-dialog">Late dialog</dialog>
      </>,
    );

    const button = screen.getByRole("button", {
      name: "Open late dialog",
    });

    const dialog = document.getElementById("late-dialog") as HTMLDialogElement;

    await user.click(button);

    await waitFor(() => {
      expect(dialog.open).toBe(true);
    });
  });

  it("tracks command attributes added after rendering", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button" data-testid="invoker">
          Open dialog
        </button>

        <dialog id="attribute-dialog">Dialog</dialog>
      </>,
    );

    const button = screen.getByTestId("invoker");
    const dialog = document.getElementById(
      "attribute-dialog",
    ) as HTMLDialogElement;

    button.setAttribute("command", "show-modal");
    button.setAttribute("commandfor", "attribute-dialog");

    // Allow the MutationObserver to process the attribute change.
    await waitFor(() => {
      expect(button.hasAttribute("command")).toBe(true);
    });

    await user.click(button);

    await waitFor(() => {
      expect(dialog.open).toBe(true);
    });
  });

  it("resolves commandfor when the button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button" command="show-modal" commandfor="dynamic-target">
          Open dialog
        </button>

        <dialog id="first-dialog">First dialog</dialog>
        <dialog id="dynamic-target">Second dialog</dialog>
      </>,
    );

    const button = screen.getByRole("button", {
      name: "Open dialog",
    });

    const firstDialog = document.getElementById(
      "first-dialog",
    ) as HTMLDialogElement;

    const secondDialog = document.getElementById(
      "dynamic-target",
    ) as HTMLDialogElement;

    await user.click(button);

    await waitFor(() => {
      expect(secondDialog.open).toBe(true);
      expect(firstDialog.open).toBe(false);
    });
  });

  //   it("dispatches a command event on the target dialog", async () => {
  //     const onCommand = vi.fn();

  //     render(
  //       <>
  //         <button type="button" command="show-modal" commandfor="event-dialog">
  //           Open dialog
  //         </button>

  //         <dialog id="event-dialog" onCommand={onCommand}>
  //           Dialog
  //         </dialog>
  //       </>,
  //     );

  //     await userClicks("Open dialog");

  //     await waitFor(() => {
  //       expect(onCommand).toHaveBeenCalledTimes(1);
  //     });

  //     const event = onCommand.mock.calls[0][0] as Event & {
  //       command: string;
  //       source: HTMLButtonElement;
  //     };

  //     expect(event.type).toBe("command");
  //     expect(event.command).toBe("show-modal");
  //     expect(event.source).toBe(
  //       screen.getByRole("button", {
  //         name: "Open dialog",
  //       }),
  //     );
  //   });

  //   it("does not open the dialog when the command event is canceled", async () => {
  //     render(
  //       <>
  //         <button type="button" command="show-modal" commandfor="cancel-dialog">
  //           Open dialog
  //         </button>

  //         <dialog
  //           id="cancel-dialog"
  //           onCommand={(event) => event.preventDefault()}
  //         >
  //           Dialog
  //         </dialog>
  //       </>,
  //     );

  //     const dialog = document.getElementById(
  //       "cancel-dialog",
  //     ) as HTMLDialogElement;

  //     await userClicks("Open dialog");

  //     await waitFor(() => {
  //       expect(dialog.open).toBe(false);
  //     });
  //   });

  it("does not track buttons after their command attribute is removed", async () => {
    const user = userEvent.setup();

    render(
      <>
        <button
          type="button"
          command="show-modal"
          commandfor="removed-command-dialog"
          data-testid="invoker"
        >
          Open dialog
        </button>

        <dialog id="removed-command-dialog">Dialog</dialog>
      </>,
    );

    const button = screen.getByTestId("invoker");
    const dialog = document.getElementById(
      "removed-command-dialog",
    ) as HTMLDialogElement;

    button.removeAttribute("command");

    await waitFor(() => {
      expect(button.hasAttribute("command")).toBe(false);
    });

    expect(dialog.open).toBe(false);

    await user.click(button);

    expect(dialog.open).toBe(false);
  });

  it("does not leave command listeners on removed buttons", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <>
        <button type="button" command="show-modal" commandfor="removed-dialog">
          Open dialog
        </button>

        <dialog id="removed-dialog">Dialog</dialog>
      </>,
    );

    const button = screen.getByRole("button", {
      name: "Open dialog",
    });

    const dialog = document.getElementById(
      "removed-dialog",
    ) as HTMLDialogElement;

    rerender(<div />);

    await user.click(button);

    expect(dialog.open).toBe(false);
  });

  //   it("does not attach duplicate listeners when initialized repeatedly", async () => {
  //     const onCommand = vi.fn();

  //     render(
  //       <>
  //         <button
  //           type="button"
  //           command="show-modal"
  //           commandfor="duplicate-dialog"
  //         >
  //           Open dialog
  //         </button>

  //         <dialog id="duplicate-dialog" onCommand={onCommand}>
  //           Dialog
  //         </dialog>
  //       </>,
  //     );

  //     const secondCleanup = installCommandInvokers();

  //     await userClicks("Open dialog");

  //     await waitFor(() => {
  //       expect(onCommand).toHaveBeenCalledTimes(1);
  //     });

  //     secondCleanup();
  //   });
});
