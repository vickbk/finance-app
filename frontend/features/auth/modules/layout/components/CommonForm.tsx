"use client";
import { ReactNode, useActionState } from "react";
import { Heading } from "react-heading-manager";
import { FormProps } from "../types";
import { FormResponseManager } from "./FormResponseManager";

export function CommonForm({
  children,
  formProps: { action, title, submitButton },
  otherOptions,
}: {
  children: ReactNode;
  formProps: FormProps;
  otherOptions?: ReactNode;
}) {
  const [message, actionTrigger, inProgress] = useActionState(action, null);

  return (
    <div>
      <form action={actionTrigger} aria-labelledby="form-title">
        <Heading id="form-title">{title}</Heading>
        {!inProgress && message && <FormResponseManager {...message} />}
        {children}
        <button type="submit" disabled={inProgress}>
          {inProgress
            ? (submitButton.loadingText ?? "submitting...")
            : submitButton.text}
        </button>
      </form>
      {otherOptions && (
        <>
          <hr />
          {otherOptions}
        </>
      )}
    </div>
  );
}
