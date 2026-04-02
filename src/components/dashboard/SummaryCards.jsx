import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { computeSummary } from '../../utils/calculations';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import './SummaryCards.css';

const CARD_CONFIG = [
  {
    key: 'balance',
    label: 'Total Balance',
    icon: Wallet,
    getValue: s => s.balance,
    colorClass: 'summary-card--balance',
    trend: s => s.savingsRate,
    trendLabel: 'savings rate',
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: ArrowUpRight,
    getValue: s => s.income,
    colorClass: 'summary-card--income',
    trend: () => null,
  },
  {
    key: 'expenses',
    label: 'Total Expenses',
    icon: ArrowDownRight,
    getValue: s => s.expenses,
    colorClass: 'summary-card--expense',
    trend: () => null,
  },
  {
    key: 'savings',
    label: 'Savings Rate',
    icon: PiggyBank,
    getValue: s => s.savingsRate,
    colorClass: 'summary-card--savings',
    isSavings: true,
  },
];

export default function SummaryCards() {
  const { transactions } = useApp();
  const summary = useMemo(() => computeSummary(transactions), [transactions]);

  return (
    <div className="summary-grid">
      {CARD_CONFIG.map((config, i) => {
        const value = config.getValue(summary);
        const Icon = config.icon;
        const TrendIcon = value >= 0 ? TrendingUp : TrendingDown;

        return (
          <div
            key={config.key}
            className={`summary-card ${config.colorClass}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="summary-card__header">
              <span className="summary-card__label">{config.label}</span>
              <div className="summary-card__icon">
                <Icon size={18} />
              </div>
            </div>
            <div className="summary-card__value">
              {config.isSavings ? `${value.toFixed(1)}%` : formatCurrency(value)}
            </div>
            {config.trend && config.trend(summary) !== null && (
              <div className={`summary-card__trend ${value >= 0 ? 'trend--up' : 'trend--down'}`}>
                <TrendIcon size={14} />
                <span>{formatPercent(config.trend(summary))}</span>
                <span className="trend-label">{config.trendLabel}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
