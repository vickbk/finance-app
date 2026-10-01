import { AuthLayout } from "@/features/auth";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Finance App Authentication",
    default: "Finance App Authenticatication",
  },
  description:
    "Finance App helps you keep track of your finances from all your devices.",
};

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
