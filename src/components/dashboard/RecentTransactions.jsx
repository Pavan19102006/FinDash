import { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCategoryLabel, getCategoryColor } from '../../data/categories';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import './RecentTransactions.css';

export default function RecentTransactions() {
  const { transactions, setPage } = useApp();

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [transactions]);

  return (
    <Card className="recent-txns">
      <div className="recent-txns__header">
        <h3 className="chart-title">Recent Transactions</h3>
        <button className="recent-txns__view-all" onClick={() => setPage('transactions')}>
          View all
        </button>
      </div>

      <div className="recent-txns__list">
        {recent.map(txn => (
          <div key={txn.id} className="recent-txn">
            <div
              className="recent-txn__icon"
              style={{ background: `${getCategoryColor(txn.category)}18`, color: getCategoryColor(txn.category) }}
            >
              {txn.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            </div>
            <div className="recent-txn__info">
              <span className="recent-txn__desc">{txn.description}</span>
              <span className="recent-txn__meta">
                {getCategoryLabel(txn.category)} · {formatDate(txn.date, 'MMM dd')}
              </span>
            </div>
            <span className={`recent-txn__amount ${txn.type === 'income' ? 'amount--income' : 'amount--expense'}`}>
              {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
