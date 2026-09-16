import { shouldSee, userClicks, userTypes } from "@/tests";
import { render, screen } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { sendResetCode } from "../actions/reset";
import { SendResetCode } from "./SendResetCode";

// Mock the signup action
vi.mock("../actions/reset", () => ({
  sendResetCode: vi.fn(),
}));

describe("SendResetCode Component", () => {
  function renderSendResetCode(child?: ReactNode) {
    return render(<SendResetCode>{child}</SendResetCode>);
  }
  describe("Form Structure & Field Rendering", () => {
    it("renders the form title and submit button with configured text", () => {
      renderSendResetCode();

      shouldSee(
        ["Reset password", 0],
        ["email", 0],
        "We'll send a verification code to this address.",
        "Send verification code",
      );
    });

    it("renders all three required input fields with correct attributes", () => {
      renderSendResetCode();

      const emailInput = screen.getByRole("textbox", { name: /email/i });

      // Email field checks
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("name", "email");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toBeRequired();
    });

    it("renders required visual indicators (*) for all inputs", () => {
      renderSendResetCode();

      const asterisks = screen.getAllByText("*");
      expect(asterisks).toHaveLength(1);
      asterisks.forEach((asterisk) => {
        expect(asterisk).toHaveTextContent("*");
        expect(asterisk).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("renders children correctly", () => {
      const text = "this is a child element";
      renderSendResetCode(<div>{text}</div>);
      shouldSee(text);
    });
  });

  describe("Form Submission & Action Invocation", () => {
    it("allows user typing and triggers send reset code action on submit", async () => {
      renderSendResetCode();

      const email = await userTypes("email", "jane@example.com");

      expect(email).toHaveValue("jane@example.com");

      await userClicks("Send verification code");

      expect(sendResetCode).toHaveBeenCalledTimes(1);
    });
  });
});
