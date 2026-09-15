import { shouldSee, userClicks, userTypesMultiple } from "@/tests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { signup } from "../actions";
import { SignUp } from "./SignUp";

// Mock the signup action
vi.mock("../actions", () => ({
  signup: vi.fn(),
}));

describe("SignUp Component", () => {
  describe("Form Structure & Field Rendering", () => {
    it("renders the form title and submit button with configured text", () => {
      render(<SignUp />);

      shouldSee("sign up", "create account");
    });

    it("renders all three required input fields with correct attributes", () => {
      render(<SignUp />);

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
      render(<SignUp />);

      const asterisks = screen.getAllByText("*");
      expect(asterisks).toHaveLength(3);
      asterisks.forEach((asterisk) => {
        expect(asterisk).toHaveTextContent("*");
        expect(asterisk).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  describe("Password Visibility Interaction", () => {
    it("allows toggling password visibility on the password field", async () => {
      const user = userEvent.setup();
      render(<SignUp />);

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
      render(<SignUp />);

      await userTypesMultiple({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "SecurePass123!",
      });

      const nameInput = screen.getByRole("textbox", { name: /name/i });
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const passwordInput = screen.getByLabelText(/password/i);

      expect(nameInput).toHaveValue("Jane Doe");
      expect(emailInput).toHaveValue("jane@example.com");
      expect(passwordInput).toHaveValue("SecurePass123!");

      // Submit form
      await userClicks("create account");

      expect(signup).toHaveBeenCalledTimes(1);
    });
  });
});
