import { MinimizeMenueIcon } from "./icons/MinimizeMenueIcon";
import { MenueItem } from "./MenueItem";

export function ToggleButton() {
  return (
    <label className="menue__toggler">
      <MenueItem icon={MinimizeMenueIcon} text={"Minimize Menu"} />
      <input type="checkbox" className="sr-only menue__controller" />
    </label>
  );
}
