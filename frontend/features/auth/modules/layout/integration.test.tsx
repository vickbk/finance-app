import { shouldSee } from "@/tests";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { Heading } from "react-heading-manager";
import {
  checkNormalizedHeadingReport,
  drawRegion,
} from "react-heading-manager/utils";
import { describe, expect, it } from "vitest";
import { AuthLayout } from "./index";

export async function renderAuthLayout(children: ReactNode) {
  const jsx = await AuthLayout({ children });
  return render(jsx);
}
// Simulated Real-World Login Component
function LoginForm() {
  return (
    <form aria-labelledby="login-heading">
      <Heading id="login-heading">Sign in to your account</Heading>

      <div>
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" name="email" required />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" required />
      </div>

      <button type="submit">Login</button>
    </form>
  );
}

describe("AuthLayout Integration", () => {
  it("maintains strict WCAG heading hierarchy across Layout, Illustration, and Form", async () => {
    const { container } = await renderAuthLayout(<LoginForm />);

    const region = drawRegion(container);

    const headingResult = checkNormalizedHeadingReport({ region });

    expect(headingResult.errors).toEqual([]);
    expect(headingResult.isValid).toBeTruthy();

    shouldSee(
      "welcome to the finance app",
      "keep track of your money and save for your future",
      "sign in to your account",
    );
  });

  it("co-locates complementary (<aside>) and form (<form>) landmarks cleanly", async () => {
    await renderAuthLayout(<LoginForm />);

    const complementaryLandmark = screen.getByRole("complementary");
    const mainLandmark = screen.getByRole("form");

    expect(complementaryLandmark).toBeInTheDocument();
    expect(mainLandmark).toBeInTheDocument();

    // Ensure main landmark contains the form
    const form = screen.getByRole("form", { name: /sign in to your account/i });
    expect(mainLandmark).toContainElement(form);
  });

  it("supports seamless keyboard focus flow into child form controls", async () => {
    const user = userEvent.setup();

    await renderAuthLayout(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole("button", { name: /login/i });

    // Tab through interactive elements
    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(submitBtn).toHaveFocus();
  });
});
