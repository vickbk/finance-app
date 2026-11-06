import { AuthFooter, SignUp } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
};

function Page() {
  return (
    <SignUp>
      <AuthFooter
        showGoogleSignIn
        text="Already have an account?"
        link={{ path: "/login", text: "Login Here" }}
      />
    </SignUp>
  );
}

export default Page;
