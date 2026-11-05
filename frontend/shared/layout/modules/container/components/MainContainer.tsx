import React from "react";
import { Heading, Section } from "react-heading-manager";

export function MainContainer({
  children,
  title,
  action,
}: {
  children: React.ReactNode;
  title: string;
  action?: {
    name: string;
    dialog?: React.ReactNode;
  };
}) {
  return (
    <Section aria-describedby="content-heading">
      <header>
        <Heading id="content-heading">{title}</Heading>
        {action && (
          <>
            <button
              type="button"
              command="show-modal"
              commandfor="content-dialog"
            >
              {action.name}
            </button>
          </>
        )}
      </header>
      {children}
      {action && <dialog id="content-dialog">{action.dialog}</dialog>}
    </Section>
  );
}
