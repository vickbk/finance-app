import { shouldSee, userClicks, userTypesMultiple } from "@/tests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { signin } from "../actions";
import { SignIn } from "./SignIn";

// Mock the signup action
vi.mock("../actions", () => ({
  signin: vi.fn(),
}));

describe("SignIn Component", () => {
  function renderSignIn(child = <></>) {
    return render(<SignIn>{child}</SignIn>);
  }
  describe("Form Structure & Field Rendering", () => {
    it("renders the form title and submit button with configured text", () => {
      renderSignIn();

      shouldSee(
        ["Login", 0],
        "email",
        ["password", 0],
        "forgot password?",
        "reset it here",
        ["Login", 1],
      );
    });

    it("renders all three required input fields with correct attributes", () => {
      renderSignIn();

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);

      // Email field checks
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("name", "email");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toBeRequired();

      // Password field checks
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute("name", "password");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toBeRequired();
    });

    it("renders required visual indicators (*) for all inputs", () => {
      renderSignIn();

      const asterisks = screen.getAllByText("*");
      expect(asterisks).toHaveLength(2);
      asterisks.forEach((asterisk) => {
        expect(asterisk).toHaveTextContent("*");
        expect(asterisk).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("renders children correctly", () => {
      const text = "this is a child element";
      renderSignIn(<div>{text}</div>);
      shouldSee(text);
    });
  });

  describe("Password Visibility Interaction", () => {
    it("allows toggling password visibility on the password field", async () => {
      const user = userEvent.setup();
      renderSignIn();

      const passwordInput = screen.getByLabelText(/password/i);

      expect(passwordInput).toHaveAttribute("type", "password");

      await userClicks("show password");

      expect(passwordInput).toHaveAttribute("type", "text");

      shouldSee("hide password");

      await userClicks("hide password");

      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Form Submission & Action Invocation", () => {
    it("allows user typing and triggers signin action on submit", async () => {
      renderSignIn();

      const { email, password } = await userTypesMultiple({
        email: "jane@example.com",
        password: "SecurePass123!",
      });

      expect(email).toHaveValue("jane@example.com");
      expect(password).toHaveValue("SecurePass123!");

      await userClicks("Login");

      expect(signin).toHaveBeenCalledTimes(1);
    });
  });
});
