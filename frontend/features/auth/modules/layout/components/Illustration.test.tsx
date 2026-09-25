import { shouldSee } from "@/tests";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Illustration } from "./Illustration";

describe("Illustration Component", () => {
  it("renders as an accessible complementary landmark (<aside>)", () => {
    render(<Illustration />);

    const asideElement = screen.getByRole("complementary");
    expect(asideElement).toBeInTheDocument();
    expect(asideElement.tagName.toLowerCase()).toBe("aside");
  });

  it("applies required CSS classes to the outer Aside container", () => {
    render(<Illustration />);

    const asideElement = screen.getByRole("complementary");
    expect(asideElement).toHaveClass("illustration");
  });

  it("renders the main heading text within the Heading component", () => {
    render(<Illustration />);

    shouldSee("keep track of your money and save for your future.");
  });

  it("renders the branding tag and descriptive text paragraph", () => {
    render(<Illustration />);

    const brandingTag = screen.getByText(/^finance$/i);
    expect(brandingTag).toBeInTheDocument();
    expect(brandingTag.tagName.toLowerCase()).toBe("span");

    shouldSee("personal finance app puts you in control of your spendings");
  });
});
