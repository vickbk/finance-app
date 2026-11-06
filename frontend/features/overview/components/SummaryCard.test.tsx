import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCard } from "./SummaryCard";

describe("SummaryCard", () => {
  it("renders the title and value correctly", () => {
    render(<SummaryCard title="Total Balance" value="$45,231.89" />);

    expect(screen.getByText("Total Balance")).toBeInTheDocument();
    expect(screen.getByText("$45,231.89")).toBeInTheDocument();
  });

  it("renders as an article with base summary-card class and defaults to light mode", () => {
    const { container } = render(
      <SummaryCard title="Monthly Revenue" value="$12,450.00" />,
    );

    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
    expect(article).toHaveClass("summary-card");
    expect(article).not.toHaveClass("dark");
  });

  it("applies the dark mode class when isdarkmode is set to true", () => {
    const { container } = render(
      <SummaryCard
        title="Monthly Expenses"
        value="$3,120.00"
        isdarkmode={true}
      />,
    );

    const article = container.querySelector("article");
    expect(article).toHaveClass("summary-card");
    expect(article).toHaveClass("dark");
  });

  it("renders the title inside a semantic heading component", () => {
    render(<SummaryCard title="Active Savings Pots" value="4 Active" />);

    const heading = screen.getByRole("heading", {
      name: /active savings pots/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the value inside a paragraph element", () => {
    const { container } = render(
      <SummaryCard title="Savings Rate" value="24%" />,
    );

    const paragraph = container.querySelector("p");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent("24%");
  });
});
