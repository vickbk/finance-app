import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Imports strictly through the barrel file
import { shouldSee, userClicks, userTypes, userTypesMultiple } from "@/tests";
import { act } from "react";
import {
  AuthFooter,
  ResetPassword,
  SendResetCode,
  SignIn,
  SignUp,
} from "./index";
import { renderAuthLayout } from "./modules/layout/integration.test";

// Mock server actions called by form components
vi.mock("./actions/signin.ts", () => ({
  signin: vi.fn(),
}));
vi.mock("./actions/signup.ts", () => ({
  signup: vi.fn(),
}));

vi.mock("./actions/reset", () => ({
  resetPassword: vi.fn(),
  sendResetCode: vi.fn(),
  verifyResetCode: vi.fn(),
}));

describe("Auth Module Integration Suite", () => {
  describe("AuthLayout Shell Integration", () => {
    it("wraps child content with article landmark, accessible heading, and illustration", async () => {
      await renderAuthLayout(
        <div data-testid="child-content">Auth Form Payload</div>,
      );

      const article = screen.getByRole("article");
      const [hiddenHeading] = shouldSee(
        "Welcome to the Finance App! Authenticate with your account here.",
        "Auth Form Payload",
      );

      const illustration = screen.getByRole("complementary");
      const payload = screen.getByTestId("child-content");

      expect(article).toBeInTheDocument();

      expect(hiddenHeading).toHaveClass("sr-only");
      expect(illustration).toBeInTheDocument();
      expect(payload).toBeInTheDocument();
    });
  });

  describe("SignIn View Integration", () => {
    it("renders complete Sign In page with layout, inputs, and OAuth footer", async () => {
      await act(
        async () =>
          await renderAuthLayout(
            <SignIn>
              <AuthFooter
                text="Don't have an account?"
                link={{ text: "Sign Up", path: "/signup" }}
                showGoogleSignIn={true}
              />
            </SignIn>,
          ),
      );

      // Verify layout & form headings
      expect(screen.getByRole("article")).toBeInTheDocument();

      shouldSee(["Login", 0], "email", ["password", 0], "Forgot password?", [
        "login",
        1,
      ]);

      const [, signUpLink] = shouldSee("Sign in with google", "sign up");
      expect(signUpLink).toHaveAttribute("href", "/signup");

      // Fill & submit
      await userTypesMultiple({
        email: "user@example.com",
        password: "SecurePass123!",
      });
      await userClicks("Login");

      const { signin } = await import("./actions/signin");
      await waitFor(() => {
        expect(signin).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("SignUp View Integration", () => {
    it("renders complete Sign Up page with layout, input fields, and login footer", async () => {
      await renderAuthLayout(
        <SignUp>
          {await AuthFooter({
            text: "Already have an account?",
            link: { text: "Sign In", path: "/signin" },
            showGoogleSignIn: true,
          })}
        </SignUp>,
      );

      // Verify inputs
      const [signInLink] = shouldSee(
        "sign in",
        "name",
        ["email", 0],
        ["password", 0],
      );

      expect(signInLink).toHaveAttribute("href", "/signin");

      // Submit
      await userTypesMultiple({
        name: "Alex Doe",
        email: "alex@example.com",
        password: "ComplexPass123!",
      });

      await userClicks("create account");

      const { signup } = await import("./actions/signup");
      await waitFor(() => {
        expect(signup).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Password Reset Flow Integration", () => {
    it("Step 1 (SendResetCode): renders verification code request form with resend footer", async () => {
      await renderAuthLayout(
        <SendResetCode>
          {await AuthFooter({
            text: "Remember your password?",
            link: { text: "Sign In", path: "/signin" },
          })}
        </SendResetCode>,
      );

      screen.getByText(/Reset password/i);
      const [resendLink] = shouldSee(
        "Sign in",
        "Reset password",
        "We'll send a verification code to this address.",
      );

      expect(resendLink).toHaveAttribute("href", "/signin");

      await userTypes("email", "user@test.email");
      await userClicks("Send verification code");

      const { sendResetCode } = await import("./actions/reset");
      await waitFor(() => {
        expect(sendResetCode).toHaveBeenCalledTimes(1);
      });
    });

    it("Step 2 (VerifyResetCode / ResetPassword): renders new password form with sign-in link footer", async () => {
      await renderAuthLayout(
        <ResetPassword id="reset-token-999">
          {await AuthFooter({
            text: "Remember your password?",
            link: { text: "Sign In", path: "/signin" },
          })}
        </ResetPassword>,
      );

      const [signInLink] = shouldSee(
        "sign in",
        "reset your password",
        "new password",
        "confirm password",
      );

      expect(signInLink).toHaveAttribute("href", "/signin");

      await userTypesMultiple({
        "new password": "NewSecurePassword123!",
        "confirm password": "NewSecurePassword123!",
      });

      await userClicks("reset password");

      const { resetPassword } = await import("./actions/reset");
      await waitFor(() => {
        expect(resetPassword).toHaveBeenCalledTimes(1);
      });
    });
  });
});
