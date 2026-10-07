import { shouldSee } from "@/tests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input Component", () => {
  describe("Label and Basic Structure", () => {
    it("renders label text correctly and binds it to the input element", () => {
      render(<Input label="Email Address" />);

      const label = screen.getByText("Email Address");
      const input = screen.getByRole("textbox", { name: "Email Address" });

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(label).toHaveAttribute("for", input.id);
    });

    it("renders visual required asterisk when inputParams.required is true", () => {
      render(<Input label="" inputParams={{ required: true }} />);

      const asterisk = screen.getByText("*");
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveTextContent("*");
      expect(asterisk).toHaveAttribute("aria-hidden", "true");
    });

    it("omits required asterisk when field is optional", () => {
      render(<Input label="" />);

      expect(screen.queryByTestId("sr-hidden")).not.toBeInTheDocument();
    });

    it("passes custom labelParams class names and attributes to the label element", () => {
      render(
        <Input
          label="Custom Label"
          labelParams={{
            className: "custom-label-class",
            "data-custom": "true",
          }}
        />,
      );

      const label = screen.getByText("Custom Label");
      expect(label).toHaveClass("custom-label-class");
      expect(label).toHaveAttribute("data-custom", "true");
    });
  });

  describe("Password Toggle Logic", () => {
    it("renders password toggle button for password fields", () => {
      render(<Input label="" inputParams={{ type: "password" }} />);

      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute("type", "button");
      expect(toggleButton.querySelector(".bi-eye")).toBeInTheDocument();
    });

    it("does not render password toggle button for non-password fields", () => {
      render(<Input label="" />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("toggles password visibility and updates accessibility labels on click", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Input label="Password" inputParams={{ type: "password" }} />,
      );

      const input = screen.getByLabelText("Password");
      expect(input).toHaveAttribute("type", "password");

      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });

      await user.click(toggleButton);

      expect(input).toHaveAttribute("type", "text");
      shouldSee("hide password");
      expect(container.querySelector(".bi-eye-slash")).toBeInTheDocument();

      await user.click(toggleButton);

      expect(input).toHaveAttribute("type", "password");
      shouldSee("show password");

      expect(container.querySelector(".bi-eye")).toBeInTheDocument();
    });

    it("hides toggle button when password field is disabled", () => {
      render(<Input label="" />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Validation Errors and Hints", () => {
    it("renders error message with role='alert' and connects it via aria-describedby", () => {
      render(
        <Input label="Email" error="Please enter a valid email address." />,
      );

      const input = screen.getByRole("textbox", { name: "Email" });
      const errorMessage = screen.getByRole("alert");

      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(
        "Please enter a valid email address.",
      );
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAttribute("aria-describedby", errorMessage.id);
    });

    it("renders hint content and connects it via aria-describedby", () => {
      render(
        <Input label="Password" hint="Must be at least 8 characters long." />,
      );

      const input = screen.getByLabelText("Password");
      const hintText = screen.getByText("Must be at least 8 characters long.");

      expect(hintText).toBeInTheDocument();
      expect(input).toHaveAttribute("aria-describedby", hintText.id);
    });

    it("supports ReactNode JSX elements as hints", () => {
      render(
        <Input
          label=""
          hint={
            <>
              Forgot password? <a href="/forgot-password">Reset password</a>
            </>
          }
          inputParams={{ name: "password", type: "password" }}
        />,
      );

      const hintLink = screen.getByText(/Reset password/i);
      expect(hintLink).toBeInTheDocument();
      expect(hintLink).toHaveAttribute("href", "/forgot-password");
    });

    it("combines both hintId and errorId in aria-describedby when both exist", () => {
      render(<Input label="Username" error="Error" hint="Must be unique." />);

      const input = screen.getByRole("textbox", { name: "Username" });
      const errorMessage = screen.getByRole("alert");
      const hintText = screen.getByText("Must be unique.");

      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toContain(hintText.id);
      expect(describedBy).toContain(errorMessage.id);
    });
  });
});
