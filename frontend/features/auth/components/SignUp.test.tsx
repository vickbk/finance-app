import { shouldSee, userClicks, userTypesMultiple } from "@/tests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { signup } from "../actions/signup";
import { SignUp } from "./SignUp";

// Mock the signup action
vi.mock("../actions/signup.ts", () => ({
  signup: vi.fn(),
}));

describe("SignUp Component", () => {
  function renderSignUp(child = <></>) {
    return render(<SignUp>{child}</SignUp>);
  }
  describe("Form Structure & Field Rendering", () => {
    it("renders the form title and submit button with configured text", () => {
      renderSignUp();

      shouldSee(
        "sign up",
        "name",
        "email",
        ["password", 0],
        "password must be at least 8 characters",
        "create account",
      );
    });

    it("renders all three required input fields with correct attributes", () => {
      renderSignUp();

      const nameInput = screen.getByRole("textbox", { name: /name/i });
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);

      // Name field checks
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute("name", "name");
      expect(nameInput).toBeRequired();

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
      renderSignUp();

      const asterisks = screen.getAllByText("*");
      expect(asterisks).toHaveLength(3);
      asterisks.forEach((asterisk) => {
        expect(asterisk).toHaveTextContent("*");
        expect(asterisk).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("renders children correctly", () => {
      const text = "this is a child element";
      renderSignUp(<div>{text}</div>);
      shouldSee(text);
    });
  });

  describe("Password Visibility Interaction", () => {
    it("allows toggling password visibility on the password field", async () => {
      const user = userEvent.setup();
      renderSignUp();

      const passwordInput = screen.getByLabelText(/password/i);
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });

      expect(passwordInput).toHaveAttribute("type", "password");

      // Click to reveal password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(
        screen.getByRole("button", { name: /hide password/i }),
      ).toBeInTheDocument();

      // Click to hide password
      await user.click(screen.getByRole("button", { name: /hide password/i }));
      expect(passwordInput).toHaveAttribute("type", "password");
    });
  });

  describe("Form Submission & Action Invocation", () => {
    it("allows user typing and triggers signup action on submit", async () => {
      await renderSignUp();

      expect(screen.getByText(/name/i)).toBeInTheDocument();
      const { name, email, password } = await userTypesMultiple({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "SecurePass123!",
      });

      expect(name).toHaveValue("Jane Doe");
      expect(email).toHaveValue("jane@example.com");
      expect(password).toHaveValue("SecurePass123!");

      await userClicks("create account");

      expect(signup).toHaveBeenCalledTimes(1);
    });
  });
});
