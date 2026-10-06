import { Heading } from "react-heading-manager";
import { Menue } from "./Menue";
import { ToggleButton } from "./ToggleButton";

export function MainMenue() {
  return (
    <nav aria-describedby="main-menu">
      <Heading id="main-menu">
        Finance <span className="sr-only">App</span>
      </Heading>
      <Menue />
      <ToggleButton />
    </nav>
  );
}
