import {
  shouldHaveAttributes,
  shouldSee,
  userClicks,
  userTypes,
} from "@/tests";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { verifyResetCode } from "../actions/reset";
import { VerifyResetCode } from "./VerifyResetCode";

vi.mock("../actions/reset", () => ({
  verifyResetCode: vi.fn(),
}));

describe("SendResetCode Component", () => {
  describe("Form Structure & Field Attributes", () => {
    it("renders the form title heading and submit button correctly", () => {
      render(<VerifyResetCode />);

      shouldSee(
        ["verify code", 0],
        ["verify code", 1],
        "verification code",
        "Enter the 6-digit code sent to your email address.",
      );
    });

    it("renders the code input field with all security and validation attributes", () => {
      render(<VerifyResetCode />);

      const codeInput = screen.getByLabelText(/verification code/i);

      shouldHaveAttributes(codeInput, {
        name: "code",
        type: "number",
        autocomplete: "one-time-code",
        placeholder: "123456",
        minlength: "6",
        maxlength: "6",
        required: true,
      });
    });
  });

  describe("Dynamic Hint Rendering", () => {
    it("renders personalized email hint when email prop is provided", () => {
      const testEmail = "user@example.com";
      render(<VerifyResetCode email={testEmail} />);

      const [hintText] = shouldSee(
        `Enter the 6-digit code sent to ${testEmail}.`,
        ["Verify code", 0],
        "verification code",
        ["Verify code", 1],
      );

      const input = screen.getByLabelText(/verification code/i);
      expect(input).toHaveAttribute("aria-describedby", hintText.id);
    });

    it("renders generic fallback hint when email prop is omitted", () => {
      render(<VerifyResetCode />);

      const [hintText] = shouldSee(
        "Enter the 6-digit code sent to your email address.",
      );

      const input = screen.getByLabelText(/verification code/i);
      expect(input).toHaveAttribute("aria-describedby", hintText.id);
    });
  });

  describe("Children / Other Options Rendering", () => {
    it("renders passed children inside the form options container", () => {
      render(
        <VerifyResetCode>
          <a href="/resend-code" data-testid="resend-link">
            Didn&apos;t receive code? Resend
          </a>
        </VerifyResetCode>,
      );

      const [resendLink] = shouldSee("Didn't receive code? Resend");
      expect(resendLink).toHaveAttribute("href", "/resend-code");
    });
  });

  describe("Form Interaction & Action Triggering", () => {
    it("allows entering a 6-digit verification code and submitting the form", async () => {
      render(<VerifyResetCode email="test@example.com" />);

      const codeInput = await userTypes("verification code", "654321");
      expect(codeInput).toHaveValue(654321);

      await userClicks("verify code");

      await waitFor(() => {
        expect(verifyResetCode).toHaveBeenCalledTimes(1);
      });
    });
  });
});
