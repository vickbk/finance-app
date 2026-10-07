import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Menue } from "./Menue";

describe("Menue", () => {
  it("renders the five navigation items with their expected routes and labels", () => {
    const { container } = render(<Menue />);

    expect(container.querySelector("ul")).toBeInTheDocument();
    expect(container.querySelectorAll("ul > li")).toHaveLength(5);

    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", { name: "Recurring Bills" }),
    ).toHaveAttribute("href", "/recurring-bills");
  });

  it("provides keyboard-focusable links in menu order", async () => {
    const user = userEvent.setup();
    render(<Menue />);

    for (const label of ["Overview", "transactions", "budgets", "pots"]) {
      await user.tab();
      expect(document.activeElement).toBe(
        screen.getByRole("link", { name: label }),
      );
    }
  });
});
