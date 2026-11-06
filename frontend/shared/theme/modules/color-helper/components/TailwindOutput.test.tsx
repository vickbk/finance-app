import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TailwindOutput from "./TailwindOutput";

describe("TailwindOutput Component", () => {
  const mockTailwindOutput = `@theme {\n  --color-primary: hsl(210 100% 50%);\n  --color-secondary: hsl(0 0% 20%);\n}`;
  const defaultProps = {
    tailwindOutput: mockTailwindOutput,
    copiedFormat: "",
    handleCopy: vi.fn(),
  };

  describe("Structure & Accessibility Landmarks", () => {
    it("renders the section container and heading landmark", () => {
      render(<TailwindOutput {...defaultProps} />);

      const heading = screen.getByRole("heading", {
        level: 3,
        name: "Tailwind CSS v4",
      });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass("font-semibold");
    });

    it("renders the copy button with type='button' and styling classes", () => {
      render(<TailwindOutput {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Copy Tailwind" });

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
      const { container } = render(<TailwindOutput {...defaultProps} />);

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

  describe("Tailwind Code Display", () => {
    it("renders the provided Tailwind CSS v4 output text inside the code tag", () => {
      render(<TailwindOutput {...defaultProps} />);

      const codeElement = screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "code" &&
          content.includes("--color-primary: hsl(210 100% 50%);")
        );
      });

      expect(codeElement).toBeInTheDocument();
    });

    it("handles empty tailwindOutput string gracefully without crashing", () => {
      const { container } = render(
        <TailwindOutput {...defaultProps} tailwindOutput="" />,
      );

      const codeElement = container.querySelector("code");

      expect(codeElement).toBeInTheDocument();
      expect(codeElement).toHaveTextContent("");
    });
  });

  describe("Copy Button State & Feedback", () => {
    it("displays 'Copy Tailwind' button text when copiedFormat is empty", () => {
      render(<TailwindOutput {...defaultProps} copiedFormat="" />);

      expect(
        screen.getByRole("button", { name: "Copy Tailwind" }),
      ).toBeInTheDocument();
    });

    it("displays 'Copy Tailwind' button text when copiedFormat is a different format (e.g. 'sass')", () => {
      render(<TailwindOutput {...defaultProps} copiedFormat="sass" />);

      expect(
        screen.getByRole("button", { name: "Copy Tailwind" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Copied!" }),
      ).not.toBeInTheDocument();
    });

    it("displays 'Copied!' button text when copiedFormat is 'tailwind'", () => {
      render(<TailwindOutput {...defaultProps} copiedFormat="tailwind" />);

      expect(
        screen.getByRole("button", { name: "Copied!" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Copy Tailwind" }),
      ).not.toBeInTheDocument();
    });
  });

  describe("User Interactions & Callbacks", () => {
    it("invokes handleCopy with tailwindOutput string and 'tailwind' format identifier on click", async () => {
      const user = userEvent.setup();
      const handleCopy = vi.fn().mockResolvedValue(undefined);

      render(<TailwindOutput {...defaultProps} handleCopy={handleCopy} />);

      const copyButton = screen.getByRole("button", { name: "Copy Tailwind" });
      await user.click(copyButton);

      expect(handleCopy).toHaveBeenCalledTimes(1);
      expect(handleCopy).toHaveBeenCalledWith(mockTailwindOutput, "tailwind");
    });

    it("supports successive clicks triggering handleCopy each time", async () => {
      const user = userEvent.setup();
      const handleCopy = vi.fn().mockResolvedValue(undefined);

      render(<TailwindOutput {...defaultProps} handleCopy={handleCopy} />);

      const copyButton = screen.getByRole("button", { name: "Copy Tailwind" });
      await user.click(copyButton);
      await user.click(copyButton);

      expect(handleCopy).toHaveBeenCalledTimes(2);
    });
  });
});
