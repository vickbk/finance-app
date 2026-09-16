import Link from "next/link";
import { ReactNode } from "react";
import { signin } from "../actions";
import { CommonForm } from "../modules/layout";
import { Input } from "./Input";

export function SignIn({ children }: { children: ReactNode }) {
  return (
    <CommonForm
      formProps={{
        title: "Login",
        action: signin,
        submitButton: {
          text: "Login",
          loadingText: "Logging in...",
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
      />
      <Input
        label="Password"
        inputParams={{ name: "password", required: true, type: "password" }}
        hint={
          <span>
            Forgot password? <Link href={"/reset"}>Reset it here</Link>
          </span>
        }
      />
    </CommonForm>
  );
}
