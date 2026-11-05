import { MainMenue, MenueItem } from "@/shared/layout";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MainMenue>
        <button type="button">
          <MenueItem text="Light theme" icon={() => <span>☀️</span>} />
        </button>
      </MainMenue>
      {children}
    </>
  );
}
