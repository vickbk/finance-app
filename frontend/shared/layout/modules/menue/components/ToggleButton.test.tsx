import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ToggleButton } from "./ToggleButton";

describe("ToggleButton", () => {
  it("renders an accessible unchecked checkbox in the screen-reader-only class", () => {
    const { container } = render(<ToggleButton />);
    const checkbox = screen.getByRole("checkbox", { name: "Minimize Menu" });

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveClass("sr-only", "menue__controller");
    expect(checkbox.closest("label")).toHaveClass("menue__toggler");

    expect(container.querySelector("button")).not.toBeInTheDocument();
  });

  it("toggles when activated by pointer or keyboard", async () => {
    const user = userEvent.setup();
    render(<ToggleButton />);
    const checkbox = screen.getByRole("checkbox", { name: "Minimize Menu" });

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.keyboard(" ");
    expect(checkbox).not.toBeChecked();
  });
});
