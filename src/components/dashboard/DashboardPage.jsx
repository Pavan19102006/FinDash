import SummaryCards from './SummaryCards';
import BalanceTrend from './BalanceTrend';
import SpendingBreakdown from './SpendingBreakdown';
import RecentTransactions from './RecentTransactions';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <SummaryCards />
      <div className="dashboard-row">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>
      <div className="dashboard-row">
        <RecentTransactions />
      </div>
    </div>
  );
}
