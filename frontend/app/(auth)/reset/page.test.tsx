import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthLayout } from "@/features/auth";
import { shouldSee, userClicks, userTypes } from "@/tests";
import { resolveRscTree } from "@/tests/vitest";
import Page from "./page";

// Mock the server action invoked when requesting a password reset code
vi.mock("@/features/auth/actions/reset", () => ({
  sendResetCode: vi.fn(),
}));

describe("SendResetCode Page Integration", () => {
  async function renderSendResetCode() {
    return render(
      await resolveRscTree(
        <AuthLayout>
          <Page />
        </AuthLayout>,
      ),
    );
  }

  describe("Rendering & Navigation", () => {
    it("renders the password reset landmark, email input, OAuth provider, and login link", async () => {
      await renderSendResetCode();

      // Verify page layout landmark
      expect(screen.getByRole("article")).toBeInTheDocument();

      // Assert form heading, email field, and reset code submit button
      shouldSee("Reset password", "email", "send verification code");

      // Assert Google OAuth button and "Login here" redirect link destination
      const [, , loginLink] = shouldSee(
        "Sign in with google",
        "Remember your password?",
        "Login here",
      );

      expect(loginLink).toHaveAttribute("href", "/login");
    });
  });

  describe("Form Submission & Action Execution", () => {
    it("captures the typed email address and invokes the sendResetCode server action upon submission", async () => {
      await renderSendResetCode();

      // Fill in recipient email address
      await userTypes("email", "user@example.com");

      // Trigger form submission
      await userClicks("Send verification code");

      // Verify server action execution
      const { sendResetCode } = await import("@/features/auth/actions/reset");
      await waitFor(() => {
        expect(sendResetCode).toHaveBeenCalledTimes(1);
      });
    });
  });
});
