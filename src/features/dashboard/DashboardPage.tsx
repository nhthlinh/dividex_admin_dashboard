import { TodaysOverview } from "../../components/TodaysOverview";
import { UserInsights } from "../../components/UserInsights";
import { CashFlowChart } from "../../components/CashFlowChart";
import { UserSatisfaction } from "../../components/UserSatisfaction";
import { TopUser } from "../../components/TopUser";
import { RateChart } from "../../components/RateChart";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Row 1 */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          <div className="min-w-[300px] lg:flex-1 lg:min-w-0">
            <TodaysOverview />
          </div>
          <div className="min-w-[300px] lg:w-[33%] lg:min-w-0">
            <UserInsights />
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          <div className="min-w-[300px] lg:flex-1 lg:min-w-0">
            <CashFlowChart />
          </div>
          <div className="min-w-[300px] lg:flex-1 lg:min-w-0">
            <UserSatisfaction />
          </div>
          <div className="min-w-[300px] lg:flex-1 lg:min-w-0">
            <RateChart />
          </div>
        </div>
      </div>

      {/* Top User */}
      <TopUser />
    </div>
  );
}

