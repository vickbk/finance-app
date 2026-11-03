import type { ComponentType } from "react";

export function MenueItem({
  icon: Icon,
  text,
}: {
  icon: ComponentType;
  text: string;
}) {
  return (
    <>
      <Icon /> {text}
    </>
  );
}
