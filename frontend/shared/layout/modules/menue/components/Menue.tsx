import Link from "next/link";
import BudgetsIcon from "../assets/icon-nav-budgets.svg";
import OverviewIcon from "../assets/icon-nav-overview.svg";
import PotsIcon from "../assets/icon-nav-pots.svg";
import RecuringIcon from "../assets/icon-nav-recurring-bills.svg";
import TransactionsIcon from "../assets/icon-nav-transactions.svg";
import { MenueItem } from "./MenueItem";

export function Menue() {
  return (
    <ul>
      {[
        { icon: OverviewIcon, path: "/", text: "Overview" },
        { icon: TransactionsIcon, path: "/transactions" },
        { icon: BudgetsIcon, path: "/budgets" },
        { icon: PotsIcon, path: "/pots" },
        {
          icon: RecuringIcon,
          path: "/recurring-bills",
          text: "Recurring Bills",
        },
      ].map(({ icon, path, text }, index) => (
        <li key={index}>
          <Link href={path}>
            <MenueItem icon={icon} text={text ?? path.replace("/", "")} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
