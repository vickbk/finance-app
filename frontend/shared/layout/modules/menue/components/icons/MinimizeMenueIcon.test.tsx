import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MinimizeMenueIcon } from "./MinimizeMenueIcon";

describe("MinimizeMenueIcon", () => {
  it("renders the expected SVG structure", () => {
    const { container } = render(<MinimizeMenueIcon />);
    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
    expect({
      attributes: {
        width: svg?.getAttribute("width"),
        height: svg?.getAttribute("height"),
        viewBox: svg?.getAttribute("viewBox"),
        fill: svg?.getAttribute("fill"),
      },
      paths: svg?.querySelectorAll("path").length,
    }).toMatchSnapshot();
  });
});
