import { ReactNode } from "react";
import { sendResetCode } from "../actions/reset";
import { CommonForm } from "../modules/layout";
import { Input } from "./Input";

export function SendResetCode({ children }: { children?: ReactNode }) {
  return (
    <CommonForm
      formProps={{
        title: "Reset password",
        action: sendResetCode,
        submitButton: {
          text: "Send verification code",
          loadingText: "Sending code...",
        },
      }}
      otherOptions={children}
    >
      <Input
        label="Email"
        inputParams={{
          name: "email",
          required: true,
          type: "email",
          autoComplete: "email",
        }}
        hint={<span>We'll send a verification code to this address.</span>}
      />
    </CommonForm>
  );
}
