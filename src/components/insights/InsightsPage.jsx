import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Award, BarChart3,
  ArrowUpDown, Target, Repeat,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { computeInsights } from '../../utils/calculations';
import { getCategoryColor } from '../../data/categories';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import Card from '../common/Card';
import './InsightsPage.css';

function StatCard({ icon: Icon, label, value, subtext, accent }) {
  return (
    <Card className="insight-stat">
      <div className="insight-stat__icon" style={{
        background: `${accent}14`,
        color: accent,
      }}>
        <Icon size={20} />
      </div>
      <div className="insight-stat__body">
        <span className="insight-stat__label">{label}</span>
        <span className="insight-stat__value">{value}</span>
        {subtext && <span className="insight-stat__sub">{subtext}</span>}
      </div>
    </Card>
  );
}

export default function InsightsPage() {
  const { transactions, theme } = useApp();
  const insights = useMemo(() => computeInsights(transactions), [transactions]);

  const gridColor = theme === 'dark' ? '#2a2d3e' : '#eef1f6';
  const textColor = theme === 'dark' ? '#6b6f8d' : '#8e92a8';

  const monthlyChartData = insights.monthlyData.map(m => ({
    ...m,
    name: m.shortLabel,
  }));

  const categoryChartData = insights.breakdown.slice(0, 6).map(item => ({
    name: item.label,
    amount: item.amount,
    color: getCategoryColor(item.category),
  }));

  const momDirection = insights.monthOverMonthChange >= 0 ? 'up' : 'down';

  return (
    <div className="insights-page animate-fade-in">
      <div className="insights-stats">
        <StatCard
          icon={Award}
          label="Top Spending Category"
          value={insights.highestCategory?.label || '—'}
          subtext={insights.highestCategory ? formatCurrency(insights.highestCategory.amount) : null}
          accent="#f43f5e"
        />
        <StatCard
          icon={ArrowUpDown}
          label="Month over Month"
          value={insights.monthOverMonthChange !== null ? formatPercent(insights.monthOverMonthChange) : '—'}
          subtext={momDirection === 'up' ? 'Spending increased' : 'Spending decreased'}
          accent={momDirection === 'up' ? '#ef4444' : '#10b981'}
        />
        <StatCard
          icon={BarChart3}
          label="Avg Monthly Expense"
          value={formatCurrency(insights.avgMonthlyExpense)}
          subtext={`Income avg: ${formatCurrency(insights.avgMonthlyIncome)}`}
          accent="#6366f1"
        />
        <StatCard
          icon={Target}
          label="Lowest Category"
          value={insights.lowestCategory?.label || '—'}
          subtext={insights.lowestCategory ? formatCurrency(insights.lowestCategory.amount) : null}
          accent="#10b981"
        />
      </div>

      <div className="insights-charts">
        <Card className="insights-chart-card">
          <h3 className="chart-title">Monthly Income vs Expenses</h3>
          <p className="chart-subtitle">Side-by-side comparison over 6 months</p>
          <div className="insights-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: textColor, fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: textColor, fontSize: 12 }}
                  tickFormatter={v => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                  formatter={(value) => [formatCurrency(value)]}
                />
                <Bar dataKey="income" name="Income" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28}
                  animationBegin={200} animationDuration={1200} animationEasing="ease-out" />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={28}
                  animationBegin={500} animationDuration={1200} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="insights-chart-card">
          <h3 className="chart-title">Category Breakdown</h3>
          <p className="chart-subtitle">Top 6 expense categories by total spend</p>
          <div className="insights-chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: textColor, fontSize: 12 }}
                  tickFormatter={v => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: textColor, fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                  formatter={(value) => [formatCurrency(value)]}
                />
                <Bar dataKey="amount" name="Amount" radius={[0, 6, 6, 0]} barSize={24}
                  animationBegin={300} animationDuration={1400} animationEasing="ease-out">
                  {categoryChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {insights.topRecurring.length > 0 && (
        <Card className="recurring-card">
          <div className="recurring-header">
            <Repeat size={18} />
            <h3 className="chart-title">Recurring Expenses</h3>
          </div>
          <p className="chart-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
            Expenses that appear multiple times across the tracked period
          </p>
          <div className="recurring-list">
            {insights.topRecurring.map((item, i) => (
              <div key={i} className="recurring-item">
                <div className="recurring-item__rank">{i + 1}</div>
                <div className="recurring-item__info">
                  <span className="recurring-item__name">{item.description}</span>
                  <span className="recurring-item__count">{item.count} occurrences</span>
                </div>
                <span className="recurring-item__total">{formatCurrency(item.totalAmount)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
