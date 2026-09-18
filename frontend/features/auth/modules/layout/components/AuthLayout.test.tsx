import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderAuthLayout } from "../integration.test";

describe("AuthLayout Component", () => {
  it("renders an accessible, visually hidden heading for screen readers", async () => {
    await renderAuthLayout(<div />);

    const srHeading = screen.getByRole("heading", {
      name: /welcome to the finance app! authenticate with your account here\./i,
    });

    expect(srHeading).toBeInTheDocument();
    expect(srHeading).toHaveClass("sr-only");
  });

  it("renders the Illustration sub-component within the layout container", async () => {
    await renderAuthLayout(<div />);

    const illustrationLandmark = screen.getByRole("complementary");
    expect(illustrationLandmark).toBeInTheDocument();
    expect(illustrationLandmark).toHaveClass("illustration");
  });

  it("renders passed child components correctly alongside the illustration", async () => {
    await renderAuthLayout(
      <form data-testid="auth-form-stub">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </form>,
    );

    const formChild = screen.getByTestId("auth-form-stub");
    expect(formChild).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("maintains the expected wrapper div structure containing Illustration and children", async () => {
    await renderAuthLayout(
      <div data-testid="child-container">Content Stub</div>,
    );

    const child = screen.getByTestId("child-container");
    const parentContainer = child.parentElement;

    expect(parentContainer).toBeInTheDocument();
    expect(parentContainer?.tagName.toLowerCase()).toBe("article");

    // Illustration (<aside>) and child should share the same parent container
    const aside = screen.getByRole("complementary");
    expect(aside.parentElement).toBe(parentContainer);
  });
});
