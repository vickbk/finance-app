import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SassOutput } from "./SassOutput";

describe("SassOutput Component", () => {
  const mockSassOutput =
    "$primary: hsl(210, 100%, 50%);\n$secondary: hsl(0, 0%, 20%);";
  const defaultProps = {
    sassOutput: mockSassOutput,
    copiedFormat: "",
    handleCopy: vi.fn(),
  };

  describe("Structure & Accessibility Landmarks", () => {
    it("renders the section container and heading landmark", () => {
      render(<SassOutput {...defaultProps} />);

      const heading = screen.getByRole("heading", {
        level: 3,
        name: "SASS Variables",
      });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass("font-semibold");
    });

    it("renders the copy button with type='button' and styling classes", () => {
      render(<SassOutput {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Copy SASS" });

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveClass(
        "px-2",
        "py-1",
        "text-sm",
        "rounded",
        "bg-blue-600",
        "text-white",
        "hover:bg-blue-700",
      );
    });

    it("renders code block container with proper layout and dark mode classes", () => {
      const { container } = render(<SassOutput {...defaultProps} />);

      const preElement = container.querySelector("pre");
      const codeElement = container.querySelector("code");

      expect(preElement).toBeInTheDocument();
      expect(preElement).toHaveClass(
        "p-3",
        "bg-neutral-100",
        "dark:bg-neutral-800",
        "rounded",
        "text-sm",
        "overflow-x-auto",
      );
      expect(codeElement).toBeInTheDocument();
    });
  });

  describe("SASS Code Display", () => {
    it("renders the provided SASS output text inside the code tag", () => {
      render(<SassOutput {...defaultProps} />);

      const codeElement = screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "code" &&
          content.includes("$primary: hsl(210, 100%, 50%);")
        );
      });

      expect(codeElement).toBeInTheDocument();
    });

    it("handles empty SASS output string gracefully", () => {
      const { container } = render(
        <SassOutput {...defaultProps} sassOutput="" />,
      );

      const codeElement = container.querySelector("code");

      expect(codeElement).toBeInTheDocument();
      expect(codeElement).toHaveTextContent("");
    });
  });

  describe("Copy Button State & Feedback", () => {
    it("displays 'Copy SASS' button text when copiedFormat is empty", () => {
      render(<SassOutput {...defaultProps} copiedFormat="" />);

      expect(
        screen.getByRole("button", { name: "Copy SASS" }),
      ).toBeInTheDocument();
    });

    it("displays 'Copy SASS' button text when copiedFormat is a different format (e.g. 'css')", () => {
      render(<SassOutput {...defaultProps} copiedFormat="css" />);

      expect(
        screen.getByRole("button", { name: "Copy SASS" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Copied!" }),
      ).not.toBeInTheDocument();
    });

    it("displays 'Copied!' button text when copiedFormat is 'sass'", () => {
      render(<SassOutput {...defaultProps} copiedFormat="sass" />);

      expect(
        screen.getByRole("button", { name: "Copied!" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Copy SASS" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("User Interactions & Callbacks", () => {
    it("invokes handleCopy with SASS output string and 'sass' format identifier on click", async () => {
      const user = userEvent.setup();
      const handleCopy = vi.fn().mockResolvedValue(undefined);

      render(<SassOutput {...defaultProps} handleCopy={handleCopy} />);

      const copyButton = screen.getByRole("button", { name: "Copy SASS" });
      await user.click(copyButton);

      expect(handleCopy).toHaveBeenCalledTimes(1);
      expect(handleCopy).toHaveBeenCalledWith(mockSassOutput, "sass");
    });

    it("supports successive clicks triggering handleCopy each time", async () => {
      const user = userEvent.setup();
      const handleCopy = vi.fn().mockResolvedValue(undefined);

      render(<SassOutput {...defaultProps} handleCopy={handleCopy} />);

      const copyButton = screen.getByRole("button", { name: "Copy SASS" });
      await user.click(copyButton);
      await user.click(copyButton);

      expect(handleCopy).toHaveBeenCalledTimes(2);
    });
  });
});
