import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthLayout } from "@/features/auth";
import { shouldSee, userClicks, userTypesMultiple } from "@/tests";
import { resolveRscTree } from "@/tests/vitest";
import Page from "./page";

// Mock the server action invoked on registration form submission
vi.mock("@/features/auth/actions/signup", () => ({
  signup: vi.fn(),
}));

describe("SignUp Page Integration", () => {
  async function renderSignUp() {
    return render(
      await resolveRscTree(
        <AuthLayout>
          <Page />
        </AuthLayout>,
      ),
    );
  }

  describe("Rendering & Navigation", () => {
    it("renders the signup form landmark, input controls, OAuth provider, and login footer link", async () => {
      await renderSignUp();

      // Verify page layout landmark
      expect(screen.getByRole("article")).toBeInTheDocument();

      // Assert registration form headings, inputs, and submit button
      shouldSee("Sign up", "name", "email", ["password", 0], "create account");

      // Assert Google OAuth button and "Login Here" redirect link destination
      const [, , loginLink] = shouldSee(
        "Sign in with google",
        "Already have an account?",
        "Login Here",
      );

      expect(loginLink).toHaveAttribute("href", "/login");
    });
  });

  describe("Form Submission & Action Execution", () => {
    it("captures user details and executes the signup server action upon submission", async () => {
      await renderSignUp();

      // Fill in signup credentials
      await userTypesMultiple({
        name: "new user",
        email: "newuser@example.com",
        password: "SecurePassword123!",
      });

      // Trigger form submission
      await userClicks("create account");

      // Verify server action execution
      const { signup } = await import("@/features/auth/actions/signup");
      await waitFor(() => {
        expect(signup).toHaveBeenCalledTimes(1);
      });
    });
  });
});
