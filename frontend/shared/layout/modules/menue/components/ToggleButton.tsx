import icon from "../assets/icon-nav-minimize.svg";
import { MenueItem } from "./MenueItem";

export function ToggleButton() {
  return (
    <button type="button">
      <MenueItem icon={icon} text={"Minimize Menu"} />
    </button>
  );
}
