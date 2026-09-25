import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { userClicks, userTypes } from "@/tests";
import { shouldNotSee, shouldSee } from "./__testing__/heplers";
import { useColorsHelper } from "./hooks";
import { ColorsHelper } from "./index";

describe("ColorsHelper Integration Component", () => {
  const mockSetColors = vi.fn();
  const mockHandleCopy = vi.fn().mockResolvedValue(undefined);

  const defaultHookState = {
    colors: "",
    setColors: mockSetColors,
    parsedColors: [],
    sassOutput: "",
    tailwindOutput: "",
    copiedFormat: "",
    handleCopy: mockHandleCopy,
  };

  const mockStyleGuideInput = `Neutral 900: hsl(0, 0%, 7%)
Neutral 800: hsl(0, 0%, 15%)
Blue 600: hsl(214, 100%, 55%)`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Rendering & Form Setup", () => {
    it("renders the section wrapper, accessible textarea label, and input control", () => {
      render(<ColorsHelper />);

      expect(screen.getByText("Colors list")).toBeInTheDocument();

      const textarea = screen.getByRole("textbox", { name: "Colors list" });
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("name", "colors");
      expect(textarea).toBeRequired();
      expect(textarea).toHaveValue("");
    });

    it("renders the placeholder text with multi-line paste examples", () => {
      render(<ColorsHelper />);

      const textarea = screen.getByRole("textbox", { name: "Colors list" });
      expect(textarea).toHaveAttribute(
        "placeholder",
        expect.stringContaining("Paste colors from style guide"),
      );
    });

    it("does NOT render output panels when parsedColors is empty", () => {
      render(<ColorsHelper />);

      shouldNotSee("Parsed Colors", "SASS Variables", "Tailwind CSS v4");
    });
  });

  describe("Textarea Interaction & State Binding", () => {
    it("invokes setColors callback on user typing into the textarea", async () => {
      const user = userEvent.setup();
      render(<ColorsHelper />);

      const textarea = screen.getByRole("textbox", { name: "Colors list" });
      await user.type(textarea, "A");

      expect(mockSetColors).toHaveBeenCalledTimes(1);
      expect(mockSetColors).toHaveBeenCalledWith("A");
    });
  });

  describe("Conditional Panel Output Display", () => {
    const populatedHookState = {
      colors: "Neutral 900: hsl(0, 0%, 7%)",
      setColors: mockSetColors,
      parsedColors: [{ name: "Neutral 900", value: "0, 0%, 7%" }],
      sassOutput: "$neutral-900: hsl(0, 0%, 7%);",
      tailwindOutput: "@theme {\n  --color-neutral-900: hsl(0, 0%, 7%);\n}",
      copiedFormat: "",
      handleCopy: mockHandleCopy,
    };

    it("renders ParsedColors, SassOutput, and TailwindOutput when parsedColors is populated", () => {
      vi.mocked(useColorsHelper).mockReturnValue(populatedHookState);

      render(<ColorsHelper />);

      expect(screen.getByText("Parsed Colors")).toBeInTheDocument();
      expect(screen.getByText("SASS Variables")).toBeInTheDocument();
      expect(screen.getByText("Tailwind CSS v4")).toBeInTheDocument();
    });

    it("passes generated SASS and Tailwind string outputs to code viewports", () => {
      vi.mocked(useColorsHelper).mockReturnValue(populatedHookState);

      render(<ColorsHelper />);

      expect(
        screen.getByText("$neutral-900: hsl(0, 0%, 7%);"),
      ).toBeInTheDocument();
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName.toLowerCase() === "code" &&
            content.includes("--color-neutral-900: hsl(0, 0%, 7%);")
          );
        }),
      ).toBeInTheDocument();
    });
  });

  describe("Copy Action Integration", () => {
    const populatedHookState = {
      colors: "Blue 600: hsl(214, 100%, 55%)",
      setColors: mockSetColors,
      parsedColors: [{ name: "Blue 600", value: "214, 100%, 55%" }],
      sassOutput: "$blue-600: hsl(214, 100%, 55%);",
      tailwindOutput: "@theme {\n  --color-blue-600: hsl(214, 100%, 55%);\n}",
      copiedFormat: "",
      handleCopy: mockHandleCopy,
    };

    it("delegates handleCopy with SASS payload when clicking Copy SASS", async () => {
      const user = userEvent.setup();
      vi.mocked(useColorsHelper).mockReturnValue(populatedHookState);

      render(<ColorsHelper />);

      const sassButton = screen.getByRole("button", { name: "Copy SASS" });
      await user.click(sassButton);

      expect(mockHandleCopy).toHaveBeenCalledTimes(1);
      expect(mockHandleCopy).toHaveBeenCalledWith(
        "$blue-600: hsl(214, 100%, 55%);",
        "sass",
      );
    });

    it("delegates handleCopy with Tailwind payload when clicking Copy Tailwind", async () => {
      const user = userEvent.setup();
      vi.mocked(useColorsHelper).mockReturnValue(populatedHookState);

      render(<ColorsHelper />);

      const tailwindButton = screen.getByRole("button", {
        name: "Copy Tailwind",
      });
      await user.click(tailwindButton);

      expect(mockHandleCopy).toHaveBeenCalledTimes(1);
      expect(mockHandleCopy).toHaveBeenCalledWith(
        "@theme {\n  --color-blue-600: hsl(214, 100%, 55%);\n}",
        "tailwind",
      );
    });

    it("reflects active copied format state on the corresponding button", async () => {
      render(<ColorsHelper />);

      await userTypes("Colors list", mockStyleGuideInput);
      await userClicks("Copy Tailwind");
      shouldSee("Copied!");
      await screen.findByText(/Copy Tailwind/i);
    });
  });
});
