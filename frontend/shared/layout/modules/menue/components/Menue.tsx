"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BudgetsIcon } from "./icons/BudgetsIcon";
import { OverviewIcon } from "./icons/OverviewIcon";
import { PotsIcon } from "./icons/PotsIcon";
import { RecurringBillsIcon } from "./icons/RecurringBillsIcon";
import { TransactionsIcon } from "./icons/TransactionsIcon";
import { MenueItem } from "./MenueItem";

const menueItems = [
  { icon: OverviewIcon, path: "/", text: "Overview" },
  { icon: TransactionsIcon, path: "/transactions" },
  { icon: BudgetsIcon, path: "/budgets" },
  { icon: PotsIcon, path: "/pots" },
  {
    icon: RecurringBillsIcon,
    path: "/recurring-bills",
    text: "Recurring Bills",
  },
];

export function Menue() {
  const pathName = usePathname();

  return (
    <ul>
      {menueItems.map(({ icon, path, text }, index) => (
        <li key={index} aria-current={pathName === path ? "page" : undefined}>
          <Link href={path}>
            <MenueItem icon={icon} text={text ?? path.replace("/", "")} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
