import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import DashboardPage from './components/dashboard/DashboardPage';
import TransactionsPage from './components/transactions/TransactionsPage';
import InsightsPage from './components/insights/InsightsPage';
import { useApp } from './context/AppContext';

function PageRouter() {
  const { activePage } = useApp();

  switch (activePage) {
    case 'transactions':
      return <TransactionsPage />;
    case 'insights':
      return <InsightsPage />;
    default:
      return <DashboardPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <PageRouter />
      </Layout>
    </AppProvider>
  );
}
