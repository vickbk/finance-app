import { loginWithGoogle } from "@/infra/auth";
import { shouldNotSee, shouldSee } from "@/tests";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SignInWithGoogle } from "./SignInWithGoogle";

// 1. Mock external authentication infra
vi.mock("@/infra/auth", () => ({
  loginWithGoogle: vi.fn(),
}));

describe("SignInWithGoogle Component", () => {
  describe("Async Component Resolution & Rendering", () => {
    it("resolves async JSX component and renders form pointing to loginWithGoogle action", async () => {
      const Element = await SignInWithGoogle();
      render(Element);

      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    it("renders the main header and the submit button", async () => {
      const Element = await SignInWithGoogle();
      render(Element);

      shouldSee("sign in with google", "Or continue with Google");
    });

    it("renders the google icon and default button text when in idle state", async () => {
      const Element = await SignInWithGoogle();
      const { container } = render(Element);

      const googleIcon = container.querySelector(".bi-google");
      expect(googleIcon).toBeInTheDocument();
      expect(googleIcon).toHaveClass("bi", "bi-google");

      shouldSee("Sign in with Google");
    });
  });

  describe("Form Submission & Pending State (useFormStatus Integration)", () => {
    it("invokes loginWithGoogle server action when submit button is clicked", async () => {
      const user = userEvent.setup();
      const Element = await SignInWithGoogle();
      render(Element);

      const submitButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });
      await user.click(submitButton);

      expect(loginWithGoogle).toHaveBeenCalledTimes(1);
    });

    it("transitions button to disabled and shows loading text during form submission pending state", async () => {
      const user = userEvent.setup();

      // Mock long-running login action to hold pending state
      let resolveAction!: () => void;
      vi.mocked(loginWithGoogle).mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveAction = resolve;
          }),
      );

      const Element = await SignInWithGoogle();
      render(Element);

      const submitButton = screen.getByRole("button", {
        name: /sign in with google/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        shouldSee("signing in with google...");
        shouldNotSee("Sign in with Google");
      });

      resolveAction();

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        shouldSee("Sign in with Google");
      });
    });
  });
});
