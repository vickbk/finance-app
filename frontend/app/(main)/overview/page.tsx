import { SummaryCard } from "@/features/overview";
import { MainContainer } from "@/shared/layout";

export default function OverviewPage() {
  return (
    <MainContainer title="Overview">
      <div>
        {[
          { title: "Total Balance", value: "$45,231.89", isdarkmode: true },
          { title: "Income", value: "$12,450.00" },
          { title: "Expenses", value: "$3,120.00" },
        ].map(({ title, value, isdarkmode }) => (
          <SummaryCard
            key={title}
            title={title}
            value={value}
            isdarkmode={isdarkmode}
          />
        ))}
      </div>
    </MainContainer>
  );
}
