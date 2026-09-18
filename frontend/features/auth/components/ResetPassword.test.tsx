import {
  shouldHaveAttributes,
  shouldSee,
  userClicks,
  userTypesMultiple,
} from "@/tests";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { resetPassword } from "../actions/reset";
import { ResetPassword } from "./ResetPassword";

// Mock the server action
vi.mock("../actions/reset", () => ({
  resetPassword: vi.fn(),
}));

describe("ResetPassword Component", () => {
  const defaultId = "user-token-123";

  describe("Form Structure & Layout Rendering", () => {
    it("renders the form title heading and submit button", () => {
      render(<ResetPassword id={defaultId} />);

      shouldSee(
        "reset your password",
        "New password",
        "Must be at least 8 characters long.",
        "confirm password",
        "reset password",
      );
    });

    it("renders both password inputs with distinct names and validation attributes", () => {
      render(<ResetPassword id={defaultId} />);

      const newPasswordInput = screen.getByLabelText(/new password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      shouldHaveAttributes(newPasswordInput, {
        name: "password",
        type: "password",
        minlength: "8",
        required: true,
      });

      shouldHaveAttributes(confirmPasswordInput, {
        name: "confirmPassword",
        type: "password",
        minlength: 8,
        required: true,
      });
    });

    it("renders the hint text for password requirements linked via aria-describedby", () => {
      render(<ResetPassword id={defaultId} />);

      const [hint] = shouldSee("Must be at least 8 characters long.");
      const newPasswordInput = screen.getByLabelText(/new password/i);

      expect(newPasswordInput).toHaveAttribute("aria-describedby", hint.id);
    });

    it("renders required visual asterisks (*) for both inputs", () => {
      render(<ResetPassword id={defaultId} />);

      const asterisks = screen.getAllByText("*");
      expect(asterisks).toHaveLength(2);
      asterisks.forEach((asterisk) => {
        expect(asterisk).toHaveTextContent("*");
        expect(asterisk).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  describe("Password Toggle Interactions", () => {
    it("allows toggling password visibility on both inputs independently", async () => {
      const user = userEvent.setup();
      render(<ResetPassword id={defaultId} />);

      const newPasswordInput = screen.getByLabelText(/new password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      const toggleButtons = screen.getAllByRole("button", {
        name: /show password/i,
      });
      expect(toggleButtons).toHaveLength(2);

      // Toggle first input visibility
      await user.click(toggleButtons[0]);
      expect(newPasswordInput).toHaveAttribute("type", "text");
      expect(confirmPasswordInput).toHaveAttribute("type", "password");

      // Toggle second input visibility
      await user.click(toggleButtons[1]);
      expect(newPasswordInput).toHaveAttribute("type", "text");
      expect(confirmPasswordInput).toHaveAttribute("type", "text");
    });
  });

  describe("Children / Other Options Slot", () => {
    it("renders passed children in the form options area", () => {
      render(
        <ResetPassword id={defaultId}>
          <a href="/login" data-testid="login-link">
            Back to login
          </a>
        </ResetPassword>,
      );

      const [loginLink] = shouldSee("Back to login");
      expect(loginLink).toHaveAttribute("href", "/login");
    });
  });

  describe("Form Submission & Action Invocation", () => {
    it("submits typed passwords and invokes resetPassword bound with id", async () => {
      render(<ResetPassword id={defaultId} />);

      const {
        "new password": newPasswordInput,
        "confirm password": confirmPasswordInput,
      } = await userTypesMultiple({
        "new password": "NewSecurePassword123!",
        "confirm password": "NewSecurePassword123!",
      });

      expect(newPasswordInput).toHaveValue("NewSecurePassword123!");
      expect(confirmPasswordInput).toHaveValue("NewSecurePassword123!");
      await userClicks("reset password");

      await waitFor(() => {
        expect(resetPassword).toHaveBeenCalledTimes(1);
      });
    });
  });
});
