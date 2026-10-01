import { shouldNotSee, shouldSee } from "@/tests";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormResponseManager } from "./FormResponseManager";

describe("FormResponseManager Component", () => {
  describe("Accessibility & Semantic Structure", () => {
    it("renders a paragraph element with aria-live='polite' attribute for screen reader notifications", () => {
      render(<FormResponseManager success={true} />);

      const paragraph = screen.getByText("Operation successful");
      expect(paragraph.tagName.toLowerCase()).toBe("p");
      expect(paragraph).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Success State Behavior", () => {
    it("renders the default success message when success is true and message prop is omitted", () => {
      render(<FormResponseManager success={true} />);

      shouldSee("Operation successful");
      shouldNotSee("Something went wrong");
    });

    it("renders a custom success message when provided", () => {
      const customSuccess =
        "Account created successfully! Please check your email.";
      render(<FormResponseManager success={true} message={customSuccess} />);

      shouldSee(customSuccess);
      shouldNotSee("Operation successful");
    });
  });

  describe("Error State Behavior", () => {
    it("renders the default error message when success is false and error prop is omitted", () => {
      render(<FormResponseManager success={false} />);

      shouldSee("Something went wrong");
      shouldNotSee("Operation successful");
    });

    it("renders a custom error message when provided", () => {
      const customError = "Invalid email address or password provided.";
      render(<FormResponseManager success={false} error={customError} />);

      shouldSee(customError);
      shouldNotSee("Something went wrong");
    });
  });

  describe("Dynamic Updates & Edge Cases", () => {
    it("dynamically updates the live region text when the success status toggles", () => {
      const { rerender } = render(
        <FormResponseManager
          success={false}
          error="Authentication failed."
          message="Welcome back!"
        />,
      );

      shouldSee("Authentication failed.");

      rerender(
        <FormResponseManager
          success={true}
          error="Authentication failed."
          message="Welcome back!"
        />,
      );

      shouldSee("Welcome back!");
      shouldNotSee("Authentication failed.");
    });

    it("renders empty text content gracefully when an empty string is provided", () => {
      const { container } = render(
        <FormResponseManager success={true} message="" />,
      );

      const paragraph = container.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent("");
    });
  });

  describe("DOM Structure Snapshots", () => {
    it("matches snapshot for success state", () => {
      const { container } = render(
        <FormResponseManager
          success={true}
          message="Signed in successfully."
        />,
      );
      expect(container.firstChild).toMatchInlineSnapshot(`
        <p
          aria-live="polite"
        >
          Signed in successfully.
        </p>
      `);
    });

    it("matches snapshot for error state", () => {
      const { container } = render(
        <FormResponseManager
          success={false}
          error="Account with this email already exists."
        />,
      );
      expect(container.firstChild).toMatchInlineSnapshot(`
        <p
          aria-live="polite"
        >
          Account with this email already exists.
        </p>
      `);
    });
  });
});
