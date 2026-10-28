import type { ComponentType } from "react";

export function MenueItem({
  icon,
  text,
}: {
  icon: ComponentType;
  text: string;
}) {
  const Icon = icon;

  return (
    <>
      <Icon /> {text}
    </>
  );
}
