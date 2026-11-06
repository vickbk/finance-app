import "react";

declare module "react" {
  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    command?:
      | "show-modal"
      | "toggle-popover"
      | "show-popover"
      | "hide-popover"
      | "close"
      | "request-close";
    commandfor?: string;
  }

  interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    onCommand?: (event: CommandEvent) => void;
  }
}

export type CommandEventInit = EventInit & {
  command: string;
  source: HTMLButtonElement;
};

export type CommandEventLike = Event & {
  command: string;
  source: HTMLButtonElement;
};

export type CommandEventConstructor = new (
  type: string,
  init: CommandEventInit,
) => CommandEventLike;
