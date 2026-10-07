import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Main } from "react-heading-manager";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Finance App",
    default: "Finance App",
  },
  description:
    "Finance App helps you keep track of your finances from all your devices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Main>{children}</Main>
      </body>
    </html>
  );
}
