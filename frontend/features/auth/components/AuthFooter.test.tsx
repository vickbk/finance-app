import { shouldNotSee, shouldSee } from "@/tests";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthFooter } from "./AuthFooter";

vi.mock("./SignInWithGoogle", () => ({
  SignInWithGoogle: () => (
    <button data-testid="sign-in-with-google" type="button">
      Sign in with Google
    </button>
  ),
}));

describe("AuthFooter Component", () => {
  describe("DOM Structure & Semantic Landmarks", () => {
    it("renders within a semantic footer landmark element", () => {
      render(<AuthFooter text="Already have an account?" />);

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      shouldSee("Already have an account?");
    });
  });

  describe("Text and Navigation Link Rendering", () => {
    it("renders prompt text without a link when link prop is omitted", () => {
      render(<AuthFooter text="Already have an account?" />);

      shouldSee("Already have an account?");
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("renders prompt text alongside Next.js Link with correct href and attributes", () => {
      render(
        <AuthFooter
          text="Don't have an account?"
          link={{ text: "Sign up", path: "/signup" }}
        />,
      );

      const [, link] = shouldSee("don't have an account?", "Sign up");

      expect(link).toHaveAttribute("href", "/signup");
    });
  });

  describe("Google OAuth Rendering", () => {
    it("omits Google Sign-In button by default when showGoogleSignIn is not provided", () => {
      render(<AuthFooter text="Already have an account?" />);

      shouldNotSee("Sign in with Google");
    });

    it("omits Google Sign-In button when showGoogleSignIn is explicitly false", () => {
      render(
        <AuthFooter text="Already have an account?" showGoogleSignIn={false} />,
      );

      shouldNotSee("Sign in with Google");
    });

    it("renders Google Sign-In button when showGoogleSignIn is true", () => {
      render(<AuthFooter text="Or continue with" showGoogleSignIn={true} />);

      shouldSee("Sign in with Google");
    });
  });
});
