import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MenueItem } from "./MenueItem";

function TestIcon() {
  return <svg aria-hidden="true" data-testid="menu-icon" />;
}

describe("MenueItem", () => {
  it("renders its text and supplied icon component", () => {
    render(<MenueItem icon={TestIcon} text="Overview" />);
    const icon = screen.getByTestId("menu-icon");

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(icon.tagName).toBe("svg");
  });

  it("renders custom icon and text props without adding a wrapper element", () => {
    const { container } = render(<MenueItem icon={TestIcon} text="Budgets" />);

    expect(container.childElementCount).toBe(1);
    expect(container.firstElementChild?.tagName).toBe("svg");
    expect(container.textContent).toContain("Budgets");
  });
});
