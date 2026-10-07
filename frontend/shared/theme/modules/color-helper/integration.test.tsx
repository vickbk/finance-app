import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { userClicks, userTypes } from "@/tests";
import { shouldNotSee, shouldSee } from "./__testing__/heplers";
import { ColorsHelper } from "./index";

describe("ColorsHelper Integration Component", () => {
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

  describe("Conditional Panel Output Display", () => {
    it("renders ParsedColors, SassOutput, and TailwindOutput when parsedColors is populated", async () => {
      render(<ColorsHelper />);

      await userTypes("Colors list", mockStyleGuideInput);
      shouldSee("Parsed Colors", "SASS Variables", "Tailwind CSS v4");
    });

    it("passes generated SASS and Tailwind string outputs to code viewports", async () => {
      render(<ColorsHelper />);

      await userTypes("Colors list", mockStyleGuideInput);
      shouldSee("neutral-900: 0 0% 7%");
    });
  });

  describe("Copy Action Integration", () => {
    it("delegates handleCopy with SASS payload when clicking Copy SASS", async () => {
      render(<ColorsHelper />);

      await userTypes("Colors list", mockStyleGuideInput);
      await userClicks("Copy SASS");

      await screen.findByText(/Copied!/i);
    });

    it("delegates handleCopy with Tailwind payload when clicking Copy Tailwind", async () => {
      render(<ColorsHelper />);

      await userTypes("Colors list", mockStyleGuideInput);
      await userClicks("Copy Tailwind");

      await screen.findByText(/Copied!/i);
    });

    it("reflects active copied format state on the corresponding button", async () => {
      render(<ColorsHelper />);

      await userTypes("Colors list", mockStyleGuideInput);
      await userClicks("Copy Tailwind");
      shouldSee("Copied!");

      await new Promise((res) => {
        setTimeout(res, 1100);
      });

      await screen.findByText(/Copy Tailwind/i);
    });
  });
});
