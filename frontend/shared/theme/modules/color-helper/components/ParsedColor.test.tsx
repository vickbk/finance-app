import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { shouldSee } from "@/tests";
import type { ParsedColor } from "../types";
import ParsedColors from "./ParsedColors";

describe("ParsedColors Component", () => {
  const mockColors: ParsedColor[] = [
    { name: "--primary", value: "210 100% 50%" },
    { name: "--secondary", value: "0 0% 20%" },
    { name: "--accent", value: "140 70% 40%" },
  ];

  describe("Structure & Accessibility Landmarks", () => {
    it("renders the section container and heading landmark", () => {
      render(<ParsedColors colors={mockColors} />);

      const [heading] = shouldSee("Parsed Colors");

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass("font-semibold", "mb-2");
    });

    it("renders list element to host color items", () => {
      render(<ParsedColors colors={mockColors} />);

      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(list).toHaveClass("flex", "flex-wrap", "gap-2");
    });
  });

  describe("List Rendering & Item Mapping", () => {
    it("renders an empty list when parsedColors array is empty", () => {
      render(<ParsedColors colors={[]} />);

      const listItems = screen.queryAllByRole("listitem");
      expect(listItems).toHaveLength(0);
    });

    it("renders the exact number of list items corresponding to input array", () => {
      render(<ParsedColors colors={mockColors} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(mockColors.length);
    });

    it("applies correct layout and dark-mode styling classes to list items", () => {
      render(<ParsedColors colors={[mockColors[0]]} />);

      const listItem = screen.getByRole("listitem");
      expect(listItem).toHaveClass(
        "flex",
        "items-center",
        "gap-2",
        "px-2",
        "py-1",
        "rounded",
        "bg-neutral-100",
        "dark:bg-neutral-800",
      );
    });
  });

  describe("Color Swatch & Code Formatting", () => {
    it("renders formatted color name and value string inside a code element", () => {
      render(<ParsedColors colors={[mockColors[0]]} />);

      const [codeElement] = shouldSee("--primary:210 100% 50%");

      expect(codeElement.tagName.toLowerCase()).toBe("code");
      expect(codeElement).toHaveClass("text-sm");
    });

    it("applies inline background color style derived from HSL value string", () => {
      render(<ParsedColors colors={[mockColors[0]]} />);

      const listItem = screen.getByRole("listitem");
      // Query span element representing swatch preview
      const swatch = within(listItem).getByText((_, element) => {
        return (
          element?.tagName.toLowerCase() === "span" &&
          element.classList.contains("w-4")
        );
      });

      expect(swatch).toBeInTheDocument();
      expect(swatch).toHaveClass("w-4", "h-4", "rounded", "border");
      expect(swatch).toHaveStyle({
        backgroundColor: "hsl(210 100% 50%)",
      });
    });
  });

  describe("Edge Cases & Formatting Variations", () => {
    it("handles comma-separated HSL value strings correctly", () => {
      const commaColor: ParsedColor[] = [
        { name: "--custom-bg", value: "210, 100%, 50%" },
      ];

      render(<ParsedColors colors={commaColor} />);

      const swatch = screen.getByRole("listitem").querySelector("span");
      expect(swatch).toHaveStyle({
        backgroundColor: "hsl(210, 100%, 50%)",
      });
      shouldSee("--custom-bg:210, 100%, 50%");
    });

    it("renders color names containing special characters or spaces without crashing", () => {
      const specialColors: ParsedColor[] = [
        { name: "color primary @1", value: "120 50% 50%" },
      ];

      render(<ParsedColors colors={specialColors} />);

      shouldSee("color primary @1:120 50% 50%");
    });
  });
});
