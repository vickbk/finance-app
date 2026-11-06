import { render } from "@testing-library/react";
import { shouldSee } from "@vickbk/tests/vitest/dom";
import { describe, expect, it } from "vitest";
import OverviewPage from "./page";

describe("OverviewPage", () => {
  it("renders the main container with Overview heading", () => {
    render(<OverviewPage />);

    shouldSee("Overview");
  });

  it("renders all summary cards with their respective titles and values", () => {
    render(<OverviewPage />);

    shouldSee(
      "Total Balance",
      "$45,231.89",
      "Income",
      "$12,450.00",
      "Expenses",
      "$3,120.00",
    );
  });

  it("applies dark mode exclusively to the Total Balance summary card", () => {
    const { container } = render(<OverviewPage />);

    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(3);

    // Total Balance is the first card and should have dark mode enabled
    expect(articles[0]).toHaveClass("summary-card");
    expect(articles[0]).toHaveClass("dark");

    // Income is the second card and should not be dark mode
    expect(articles[1]).toHaveClass("summary-card");
    expect(articles[1]).not.toHaveClass("dark");

    // Expenses is the third card and should not be dark mode
    expect(articles[2]).toHaveClass("summary-card");
    expect(articles[2]).not.toHaveClass("dark");
  });
});
