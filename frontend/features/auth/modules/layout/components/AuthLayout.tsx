import { ReactNode } from "react";
import { Heading } from "react-heading-manager";
import { Illustration } from "./Illustration";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <article>
      <Heading className="sr-only">
        Welcome to the Finance App! Authenticate with your account here.
      </Heading>

      <Illustration />
      {children}
    </article>
  );
}
