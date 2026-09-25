import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthLayout } from "@/features/auth";
import { shouldSee, userClicks, userTypesMultiple } from "@/tests";
import { resolveRscTree } from "@/tests/vitest";
import Page from "./page";

// Mock the server action invoked on form submission
vi.mock("@/features/auth/actions/signin", () => ({
  signin: vi.fn(),
}));

describe("Login Page Integration", () => {
  async function renderSignIn() {
    return render(
      await resolveRscTree(
        <AuthLayout>
          <Page />
        </AuthLayout>,
      ),
    );
  }
  describe("Rendering & Navigation", () => {
    it("renders the login form, input controls, OAuth provider, and registration footer", async () => {
      await renderSignIn();

      // Verify page layout landmark
      expect(screen.getByRole("article")).toBeInTheDocument();

      // Assert form headings, input labels, forgot password link, and submit action
      shouldSee(["Login", 0], "email", ["password", 0], "Forgot password?", [
        "login",
        1,
      ]);

      // Assert Google OAuth button and "Create an account here" link destination
      const [, createAccountLink] = shouldSee(
        "Sign in with google",
        "Create an account here",
      );

      expect(createAccountLink).toHaveAttribute("href", "/signup");
    });

    it("verifies the forgot password link redirects to the password recovery flow", async () => {
      await renderSignIn();

      const [, forgotPasswordLink] = shouldSee(
        "Forgot password?",
        "reset it here",
      );
      expect(forgotPasswordLink).toHaveAttribute("href", "/reset");
    });
  });

  describe("Form Submission & Action Execution", () => {
    it("captures typed credentials and calls the signin server action on submission", async () => {
      await renderSignIn();

      // Fill in form inputs
      await userTypesMultiple({
        email: "user@example.com",
        password: "SecurePassword123!",
      });

      // Trigger form submission
      await userClicks("Login");

      // Verify action trigger
      const { signin } = await import("@/features/auth/actions/signin");
      await waitFor(() => {
        expect(signin).toHaveBeenCalledTimes(1);
      });
    });
  });
});
