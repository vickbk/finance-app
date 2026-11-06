import { Article, Heading } from "react-heading-manager";

export function SummaryCard({
  title,
  value,
  isdarkmode = false,
}: {
  title: string;
  value: string;
  isdarkmode?: boolean;
}) {
  return (
    <Article className={`summary-card ${isdarkmode ? "dark" : ""}`}>
      <Heading>{title}</Heading>
      <p>{value}</p>
    </Article>
  );
}
