import Link from "next/link";
import { Suspense } from "react";
import { SignInWithGoogle } from "./SignInWithGoogle";

export async function AuthFooter({
  text,
  link,
  showGoogleSignIn = false,
}: {
  text: string;
  link?: {
    text: string;
    path: string;
  };
  showGoogleSignIn?: boolean;
}) {
  return (
    <footer className={``.trim()}>
      {showGoogleSignIn && (
        <Suspense>
          <SignInWithGoogle />
        </Suspense>
      )}

      <p className="">
        {text}{" "}
        {link && (
          <Link href={link.path} className="">
            {link.text}
          </Link>
        )}
      </p>
    </footer>
  );
}
