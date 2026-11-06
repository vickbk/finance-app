import { loginWithGoogle } from "@/infra/auth";
import { BiIcon, LoadingSubmit } from "@/shared/utils";
import { Heading } from "react-heading-manager";

export const SignInWithGoogle = async () => {
  return (
    <form action={loginWithGoogle} aria-labelledby="google-form">
      <Heading id="google-form">Or continue with Google</Heading>
      <LoadingSubmit
        text="Signing in with Google..."
        className="my-4 w-full cursor-pointer inline-flex items-center justify-center border-2 border-background gap-3 px-4 py-3 rounded-md shadow-sm transition-transform transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-lime-500 bg-linear-to-br from-red-500 to-green-500 text-slate-900 font-medium"
      >
        <BiIcon name="google" />
        Sign in with Google
      </LoadingSubmit>
    </form>
  );
};
