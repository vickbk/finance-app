import { Heading } from "react-heading-manager";
import { Menue } from "./Menue";
import { ToggleButton } from "./ToggleButton";

export function MainMenue({ children }: { children?: React.ReactNode }) {
  return (
    <nav aria-describedby="main-menu">
      <Heading id="main-menu">
        <span>
          Finance <span className="sr-only">App</span>
        </span>
        <span aria-hidden>f</span>
      </Heading>
      <Menue />
      <div>
        {children}
        <ToggleButton />
      </div>
    </nav>
  );
}
