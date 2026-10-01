import { render, screen, waitFor } from "@testing-library/react";
import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

import { AuthLayout } from "@/features/auth";
import { shouldSee, userClicks, userTypesMultiple } from "@/tests";
import { resolveRscTree } from "@/tests/vitest";
import Page from "./page";

// Mock next/navigation redirect hook
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock the server action invoked on password reset completion
vi.mock("@/features/auth/actions/reset", () => ({
  resetPassword: vi.fn(),
}));

describe("ResetPassword Page Integration", () => {
  async function renderResetPassword(
    paramsPromise: Promise<{ id: string }> = Promise.resolve({
      id: "valid-reset-token-123",
    }),
  ) {
    return render(
      await resolveRscTree(
        <AuthLayout>
          <Page params={paramsPromise} />
        </AuthLayout>,
      ),
    );
  }

  describe("Param Resolution & Guard Rails", () => {
    it("redirects to /reset when the reset token id parameter is missing", async () => {
      await renderResetPassword(Promise.resolve({ id: "" }));

      expect(redirect).toHaveBeenCalledWith("/reset");
    });
  });

  describe("Rendering & Navigation", () => {
    it("renders the new password fields, accessibility hint, landmark, and login link", async () => {
      await renderResetPassword();

      // Verify page layout landmark
      expect(screen.getByRole("article")).toBeInTheDocument();

      // Assert form heading, input labels, hint text, and submit button
      shouldSee(
        "Reset your password",
        "New Password",
        "Confirm Password",
        "Must be at least 8 characters long.",
        "Reset password",
      );

      // Assert login redirect link destination
      const [, loginLink] = shouldSee("Remember your password?", "Login here");

      expect(loginLink).toHaveAttribute("href", "/login");
    });
  });

  describe("Form Submission & Action Execution", () => {
    it("captures new credentials and invokes the bound resetPassword server action with the token id", async () => {
      const resetToken = "valid-reset-token-123";
      await renderResetPassword(Promise.resolve({ id: resetToken }));

      // Fill in new password and confirmation
      await userTypesMultiple({
        "new password": "NewSecurePassword123!",
        "confirm Password": "NewSecurePassword123!",
      });

      // Trigger form submission
      await userClicks("Reset password");

      // Verify server action execution bound with reset token ID
      const { resetPassword } = await import("@/features/auth/actions/reset");
      await waitFor(() => {
        expect(resetPassword).toHaveBeenCalledTimes(1);
      });
    });
  });
});
