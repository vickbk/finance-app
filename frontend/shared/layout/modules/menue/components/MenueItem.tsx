import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

export function MenueItem({
  icon,
  text,
}: {
  icon: StaticImport;
  text: string;
}) {
  return (
    <>
      <Image src={icon} alt="" width={24} height={24} /> {text}
    </>
  );
}
