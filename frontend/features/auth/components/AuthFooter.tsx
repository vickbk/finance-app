import Link from "next/link";
import { SignInWithGoogle } from "./SignInWithGoogle";

export function FormFooter({
  text,
  link,
  auth20,
}: {
  text: string;
  link?: { text: string; path: string };
  auth20?: boolean;
}) {
  return (
    <footer>
      <p>
        {text} {link && <Link href={link.path}>{link.text}</Link>}
      </p>
      {auth20 && <SignInWithGoogle />}
    </footer>
  );
}
