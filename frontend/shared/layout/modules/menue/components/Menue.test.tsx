import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Menue } from "./Menue";

// Mock next/navigation's usePathname to control active route states in tests
const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

describe("Menue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
  });

  it("renders all five navigation items with correct labels and href attributes", () => {
    const { container } = render(<Menue />);

    expect(container.querySelector("ul")).toBeInTheDocument();
    expect(container.querySelectorAll("ul > li")).toHaveLength(5);

    const expectedItems = [
      { name: "Overview", href: "/" },
      { name: "transactions", href: "/transactions" },
      { name: "budgets", href: "/budgets" },
      { name: "pots", href: "/pots" },
      { name: "Recurring Bills", href: "/recurring-bills" },
    ];

    for (const item of expectedItems) {
      const link = screen.getByRole("link", { name: item.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", item.href);
    }
  });

  it("applies aria-current='page' to the active route and removes it from others", () => {
    // Simulate current route is /budgets
    mockUsePathname.mockReturnValue("/budgets");

    render(<Menue />);

    const budgetsLink = screen.getByRole("link", { name: "budgets" });
    const budgetsLi = budgetsLink.closest("li");
    expect(budgetsLi).toHaveAttribute("aria-current", "page");

    // Verify inactive items do not have aria-current
    const overviewLink = screen.getByRole("link", { name: "Overview" });
    const overviewLi = overviewLink.closest("li");
    expect(overviewLi).not.toHaveAttribute("aria-current");
  });

  it("updates aria-current='page' when pathname changes to root", () => {
    mockUsePathname.mockReturnValue("/");

    render(<Menue />);

    const overviewLink = screen.getByRole("link", { name: "Overview" });
    const overviewLi = overviewLink.closest("li");
    expect(overviewLi).toHaveAttribute("aria-current", "page");
  });

  it("provides keyboard-focusable links in correct menu order", async () => {
    const user = userEvent.setup();
    render(<Menue />);

    const expectedLabels = [
      "Overview",
      "transactions",
      "budgets",
      "pots",
      "Recurring Bills",
    ];

    for (const label of expectedLabels) {
      await user.tab();
      expect(document.activeElement).toBe(
        screen.getByRole("link", { name: label }),
      );
    }
  });
});
