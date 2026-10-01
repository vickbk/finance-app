import { render, screen, waitFor } from "@testing-library/react";
import { redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

import { AuthLayout } from "@/features/auth";
import { shouldSee, userClicks, userTypes } from "@/tests";
import { resolveRscTree } from "@/tests/vitest";
import Page from "./page";

// Mock next/navigation redirect hook
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock the server action invoked on verification code submission
vi.mock("@/features/auth/actions/reset", () => ({
  verifyResetCode: vi.fn(),
}));

describe("VerifyResetCode Page Integration", () => {
  async function renderVerifyResetCode(
    paramsPromise: Promise<{ id: string }> = Promise.resolve({
      id: "valid-reset-id-123",
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
    it("redirects to /reset when the reset id parameter is missing", async () => {
      await renderVerifyResetCode(Promise.resolve({ id: "" }));

      expect(redirect).toHaveBeenCalledWith("/reset");
    });
  });

  describe("Rendering & Navigation", () => {
    it("renders the verification code landmark, input controls, fallback email hint, and login link", async () => {
      await renderVerifyResetCode();

      // Verify page layout landmark
      expect(screen.getByRole("article")).toBeInTheDocument();

      // Assert form heading, code input label, fallback email hint, and submit action
      shouldSee(
        ["Verify code", 0],
        "Verification Code",
        "Enter the 6-digit code sent to your email address.",
        ["Verify code", 1],
      );

      // Assert login redirect link destination
      const [, loginLink] = shouldSee("Remember your password?", "Login here");

      expect(loginLink).toHaveAttribute("href", "/login");
    });
  });

  describe("Form Submission & Action Execution", () => {
    it("captures the verification code and invokes the bound verifyResetCode action with the id", async () => {
      const resetId = "valid-reset-id-123";
      await renderVerifyResetCode(Promise.resolve({ id: resetId }));

      // Fill in 6-digit verification code
      await userTypes("verification code", "123456");

      // Trigger form submission
      await userClicks("Verify code");

      // Verify server action execution bound with reset ID
      const { verifyResetCode } = await import("@/features/auth/actions/reset");
      await waitFor(() => {
        expect(verifyResetCode).toHaveBeenCalledTimes(1);
      });
    });
  });
});
