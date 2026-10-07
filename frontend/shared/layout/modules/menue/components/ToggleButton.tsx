import { MinimizeMenueIcon } from "./icons/MinimizeMenueIcon";
import { MenueItem } from "./MenueItem";

export function ToggleButton() {
  return (
    <button type="button">
      <MenueItem icon={MinimizeMenueIcon} text={"Minimize Menu"} />
    </button>
  );
}
