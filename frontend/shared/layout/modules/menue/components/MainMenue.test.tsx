import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MainMenue } from "./MainMenue";

describe("MainMenue", () => {
  it("renders the navigation, its accessible title, links, and toggle", () => {
    const { container } = render(<MainMenue />);

    const navigation = screen.getByRole("navigation");

    expect(navigation.tagName).toBe("NAV");
    expect(screen.getByText("App")).toHaveClass("sr-only");
    expect(
      screen.getByRole("checkbox", { name: "Minimize Menu" }),
    ).toBeInTheDocument();

    expect(container.querySelectorAll("ul > li")).toHaveLength(5);
  });

  it("renders optional children before the menu toggle", () => {
    const { container } = render(
      <MainMenue>
        <a href="/profile">Profile</a>
      </MainMenue>,
    );

    expect(screen.getByRole("link", { name: "Profile" })).toBeInTheDocument();
    expect(container.querySelector("nav > div")?.textContent).toContain(
      "Profile",
    );
  });

  it("allows keyboard navigation to the first menu link", async () => {
    const user = userEvent.setup();
    render(<MainMenue />);

    await user.tab();

    expect(document.activeElement).toBe(
      screen.getByRole("link", { name: "Overview" }),
    );
  });
});
