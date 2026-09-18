import { ReactNode } from "react";
import { signup } from "../actions/signup";
import { CommonForm } from "../modules/layout";
import { Input } from "./Input";

export function SignUp({ children }: { children: ReactNode }) {
  return (
    <CommonForm
      formProps={{
        title: "Sign Up",
        action: signup,
        submitButton: {
          text: "Create Account",
          loadingText: "Creating account...",
        },
      }}
      otherOptions={children}
    >
      <Input
        label="Name"
        inputParams={{ name: "name", required: true, autoComplete: "name" }}
      />
      <Input
        label="Email"
        inputParams={{
          name: "email",
          required: true,
          type: "email",
          autoComplete: "email",
        }}
      />
      <Input
        label="Password"
        inputParams={{ name: "password", required: true, type: "password" }}
        hint={<span>Password must be at least 8 characters</span>}
      />
    </CommonForm>
  );
}
