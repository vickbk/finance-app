import { AuthFooter, SignIn } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to your account",
};

function Page() {
  return (
    <SignIn>
      <AuthFooter
        text="Don't have an account?"
        link={{ path: "/signup", text: "Create an account here" }}
        showGoogleSignIn
      />
    </SignIn>
  );
}

export default Page;
