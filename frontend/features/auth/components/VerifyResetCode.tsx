import { ReactNode } from "react";
import { verifyResetCode } from "../actions/reset";
import { CommonForm } from "../modules/layout";
import { Input } from "./Input";

export function VerifyResetCode({
  email,
  children,
}: {
  email?: string;
  children?: ReactNode;
}) {
  return (
    <CommonForm
      formProps={{
        title: "Verify code",
        action: verifyResetCode,
        submitButton: {
          text: "Verify code",
          loadingText: "Verifying code...",
        },
      }}
      otherOptions={children}
    >
      <Input
        label="Verification Code"
        inputParams={{
          name: "code",
          type: "number",
          autoComplete: "one-time-code",
          required: true,
          minLength: 6,
          maxLength: 6,
          placeholder: "123456",
        }}
        hint={
          email
            ? `Enter the 6-digit code sent to ${email}.`
            : "Enter the 6-digit code sent to your email address."
        }
      />
    </CommonForm>
  );
}
