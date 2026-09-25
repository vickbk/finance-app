import { formatAbsoluteDate } from "./format-absolute-date";

export function getLookbackDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return formatAbsoluteDate(date.getTime());
}
