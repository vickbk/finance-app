import { shouldSee, userClicks } from "@/tests";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommonFormAction, FormProps } from "../types";
import { CommonForm } from "./CommonForm";

describe("CommonForm Component", () => {
  const defaultFormProps: FormProps = {
    title: "Sign In",
    action: vi.fn(async () => ({ success: true })),
    submitButton: {
      text: "Submit",
      loadingText: "Processing...",
    },
  };

  const renderForm = (
    formProps: FormProps = defaultFormProps,
    otherOptions?: React.ReactNode,
  ) => {
    return render(
      <CommonForm formProps={formProps} otherOptions={otherOptions}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" />
        </div>
      </CommonForm>,
    );
  };

  describe("Initial Rendering & Layout", () => {
    it("renders the form element with proper aria-describedby linkage to heading", () => {
      renderForm();

      const form = screen.getByRole("form");
      const heading = screen.getByRole("heading", { name: "Sign In" });

      expect(form).toBeInTheDocument();
      expect(heading).toHaveAttribute("id", "form-title");
      expect(form).toHaveAttribute("aria-labelledby", "form-title");
    });

    it("renders children elements passed into the form body", () => {
      renderForm();

      shouldSee(/email/i);
    });

    it("renders the submit button with standard text in idle state", () => {
      renderForm();

      const submitButton = screen.getByRole("button", { name: "Submit" });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    it("does not render response manager or horizontal rule initially", () => {
      const { container } = renderForm();

      expect(container.querySelector("hr")).not.toBeInTheDocument();
      expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
    });
  });

  describe("Other Options & Divider Rendering", () => {
    it("renders horizontal separator and extra options when provided", () => {
      const otherOptions = (
        <a href="/forgot-password" data-testid="forgot-password-link">
          Forgot password?
        </a>
      );

      const { container } = renderForm(defaultFormProps, otherOptions);

      expect(container.querySelector("hr")).toBeInTheDocument();
      expect(screen.getByTestId("forgot-password-link")).toBeInTheDocument();
    });

    it("omits horizontal separator when otherOptions is undefined", () => {
      const { container } = renderForm(defaultFormProps, undefined);

      expect(container.querySelector("hr")).not.toBeInTheDocument();
    });
  });

  describe("Form Submission & Action States (useActionState)", () => {
    it("disables submit button and displays custom loadingText during action pending state", async () => {
      const user = userEvent.setup();
      let resolveAction!: (value: unknown) => void;

      const asyncAction = vi.fn(
        () =>
          new Promise((resolve) => {
            resolveAction = resolve;
          }),
      ) as CommonFormAction;

      const props: FormProps = {
        title: "Sign Up",
        action: asyncAction,
        submitButton: { text: "Create Account", loadingText: "Creating..." },
      };

      renderForm(props);

      const submitButton = screen.getByRole("button", {
        name: "Create Account",
      });
      await user.click(submitButton);

      // Verify pending state
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent("Creating...");
      });

      // Resolve action
      resolveAction({ success: true, message: "Account created!" });

      // Verify reset back to idle state
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent("Create Account");
      });
    });

    it("uses default 'submitting...' fallback when loadingText is omitted in submitButton prop", async () => {
      const user = userEvent.setup();

      const asyncAction = vi.fn(
        () => new Promise((resolve) => setTimeout(() => resolve(null), 100)),
      ) as CommonFormAction;

      const propsWithoutLoadingText: FormProps = {
        title: "Reset Password",
        action: asyncAction,
        submitButton: { text: "Send Link" },
      };

      renderForm(propsWithoutLoadingText);

      const sendBtn = screen.getByRole("button", { name: "Send Link" });
      await user.click(sendBtn);

      await waitFor(() => {
        expect(sendBtn).toHaveTextContent("submitting...");
      });
    });

    it("renders FormResponseManager message upon action completion when not pending", async () => {
      const actionWithMessage = vi.fn(async () => ({
        success: true,
        message: "Welcome back to your dashboard!",
      }));

      const props: FormProps = {
        title: "Login",
        action: actionWithMessage,
        submitButton: { text: "Login" },
      };

      renderForm(props);

      await userClicks("Login");
      const responseMessage = await screen.findByText(
        "Welcome back to your dashboard!",
      );

      expect(responseMessage).toBeInTheDocument();
      expect(responseMessage).toHaveAttribute("aria-live", "polite");
    });

    it("renders error message via FormResponseManager when action returns error payload", async () => {
      const user = userEvent.setup();

      const actionWithError = vi.fn(async () => ({
        success: false,
        error: "Invalid email or password credentials.",
      }));

      const props: FormProps = {
        title: "Login",
        action: actionWithError,
        submitButton: { text: "Login" },
      };

      renderForm(props);

      const button = screen.getByRole("button", { name: "Login" });

      await user.click(button);

      await expect(
        await screen.findByText("Invalid email or password credentials."),
      ).toBeInTheDocument();
    });
  });
});
