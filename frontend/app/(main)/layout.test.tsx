import { render, screen } from "@testing-library/react";
import { shouldSee } from "@vickbk/tests/vitest";
import { describe, expect, it } from "vitest";
import MainLayout from "./layout";

describe("MainLayout", () => {
  it("renders children content correctly within the layout", () => {
    render(
      <MainLayout>
        <div data-testid="page-content">Overview Dashboard Content</div>
      </MainLayout>,
    );

    shouldSee("Overview Dashboard Content");
  });

  it("renders the MainMenue navigation element", () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );

    const navElement = screen.getByRole("navigation");
    expect(navElement).toBeInTheDocument();
  });

  it("renders the theme toggle button with correct button type", () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );

    const [themeButton] = shouldSee("Light theme");
    expect(themeButton).toHaveAttribute("type", "button");
  });

  it("renders the MenueItem text and icon successfully", () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
    );

    shouldSee("Light theme", "☀️");
  });
});
