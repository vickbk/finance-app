import Link from "next/link";
import { SignInWithGoogle } from "./SignInWithGoogle";

export function AuthFooter({
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
      {showGoogleSignIn && <SignInWithGoogle />}

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
