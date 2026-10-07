import Link from "next/link";
import { OverviewIcon } from "./icons/OverviewIcon";
import { BudgetsIcon } from "./icons/BudgetsIcon";
import { PotsIcon } from "./icons/PotsIcon";
import { RecurringBillsIcon } from "./icons/RecurringBillsIcon";
import { TransactionsIcon } from "./icons/TransactionsIcon";
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
          icon: RecurringBillsIcon,
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
