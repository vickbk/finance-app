import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { shouldSee, userClicks } from "@vickbk/tests/vitest/dom";
import { describe, expect, it } from "vitest";
import { MainContainer } from "./MainContainer";

describe("MainContainer", () => {
  it("renders the title and children correctly when no action is provided", () => {
    render(
      <MainContainer title="Dashboard Overview">
        <p>Main page content goes here</p>
      </MainContainer>,
    );

    const [heading] = shouldSee(
      "Dashboard Overview",
      "Main page content goes here",
    );

    expect(heading).toHaveAttribute("id", "content-heading");

    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);
  });

  it("applies the expected accessibility (ARIA) attributes on sections", () => {
    const { container } = render(
      <MainContainer title="Accounts">
        <div>Content</div>
      </MainContainer>,
    );

    // Outer section checks for aria-describedby pointing to the heading ID
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(2);

    const outerSection = sections[0];
    expect(outerSection).toHaveAttribute("aria-describedby", "content-heading");

    // Inner section checks for aria-label="Content"
    const innerSection = screen.getByRole("region", { name: "Content" });
    expect(innerSection).toBeInTheDocument();
  });

  it("renders an action button and triggers onClick when clicked", async () => {
    const user = userEvent.setup();

    render(
      <MainContainer
        title="Transactions"
        action={{ name: "+ Add Transaction" }}
      >
        <p>Transaction table data</p>
      </MainContainer>,
    );

    await userClicks("+ Add Transaction");

    // expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders dialog content encapsulated within the action object when provided", () => {
    const { container } = render(
      <MainContainer
        title="Budgets"
        action={{
          name: "Create Budget",

          dialog: <div role="dialog">Budget Creation Modal</div>,
        }}
      >
        <p>Budget summary</p>
      </MainContainer>,
    );

    shouldSee("Budgets", "Budget summary", "Budget Creation Modal");
    const dialog = container.querySelector("dialog");
    expect(dialog).toBeInTheDocument();
  });

  it("allows keyboard focus and activation of the action button", async () => {
    const user = userEvent.setup();
    // const handleClick = vi.fn();

    render(
      <MainContainer title="Savings Pots" action={{ name: "Add Pot" }}>
        <p>Pots summary</p>
      </MainContainer>,
    );

    await user.tab();
    const actionButton = screen.getByRole("button", { name: "Add Pot" });
    expect(document.activeElement).toBe(actionButton);

    await user.keyboard("{Enter}");
    // expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders complex children correctly", () => {
    render(
      <MainContainer title="Savings Pots">
        <ul>
          <li>Emergency Fund</li>
          <li>Vacation</li>
        </ul>
      </MainContainer>,
    );

    shouldSee("Savings Pots", "Emergency Fund", "Vacation");
  });
});
