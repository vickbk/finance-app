import { AuthFooter, SendResetCode } from "@/features/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset your password",
};

function Page() {
  return (
    <SendResetCode>
      <AuthFooter
        showGoogleSignIn
        text="Remember your password?"
        link={{ text: "Login here", path: "/login" }}
      />
    </SendResetCode>
  );
}

export default Page;
