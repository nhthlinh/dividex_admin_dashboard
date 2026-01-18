import { TodaysOverview } from "../../components/TodaysOverview";
import { UserInsights } from "../../components/UserInsights";
import { CashFlowChart } from "../../components/CashFlowChart";
import { UserSatisfaction } from "../../components/UserSatisfaction";
import { TopUser } from "../../components/TopUser";
import { RateChart } from "../../components/RateChart";

export function DashboardPage() {
  return (
    <div className="grid gap-6">
      {/* Today's Overview and User Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodaysOverview />
        </div>
        <div className="lg:col-span-1">
          <UserInsights />
        </div>
      </div>

      {/* Cash Flow, User Satisfaction*/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CashFlowChart />
        </div>
        <div className="lg:col-span-1">
          <UserSatisfaction />
        </div>
        <div className="lg:col-span-1">
          <RateChart />
        </div>
      </div>

      {/* Top User */}
      <TopUser />
    </div>
  );
}
