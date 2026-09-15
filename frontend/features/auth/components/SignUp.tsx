import { signup } from "../actions";
import { CommonForm } from "../modules/layout";
import { Input } from "./Input";

export function SignUp() {
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
    >
      <Input label="Name" inputParams={{ name: "name", required: true }} />
      <Input
        label="Email"
        inputParams={{ name: "email", required: true, type: "email" }}
      />
      <Input
        label="Password"
        inputParams={{ name: "password", required: true, type: "password" }}
      />
    </CommonForm>
  );
}
