import { ReactNode } from "react";
import { resetPassword } from "../actions/reset";
import { CommonForm } from "../modules/layout";
import { Input } from "./Input";

export function ResetPassword({
  id,
  children,
}: {
  id: string;
  children?: ReactNode;
}) {
  return (
    <CommonForm
      formProps={{
        title: "Reset your password",
        action: resetPassword.bind(null, id),
        submitButton: {
          text: "Reset password",
          loadingText: "Resetting password...",
        },
      }}
      otherOptions={children}
    >
      <Input
        label="New Password"
        inputParams={{
          name: "password",
          type: "password",
          required: true,
          minLength: 8,
        }}
        hint="Must be at least 8 characters long."
      />
      <Input
        label="Confirm Password"
        inputParams={{
          name: "confirmPassword",
          type: "password",
          required: true,
          minLength: 8,
        }}
      />
    </CommonForm>
  );
}
