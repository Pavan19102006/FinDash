import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';
import { computeCategoryBreakdown } from '../../utils/calculations';
import { getCategoryColor } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';
import Card from '../common/Card';
import './SpendingBreakdown.css';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { label, amount, percentage } = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      <div className="chart-tooltip__row">
        <span
          className="chart-tooltip__dot"
          style={{ background: payload[0].payload.fill }}
        />
        <span className="chart-tooltip__name">{formatCurrency(amount)}</span>
        <span className="chart-tooltip__value">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export default function SpendingBreakdown() {
  const { transactions } = useApp();
  const breakdown = useMemo(() => computeCategoryBreakdown(transactions), [transactions]);

  const chartData = breakdown.map(item => ({
    ...item,
    fill: getCategoryColor(item.category),
  }));

  const total = breakdown.reduce((s, b) => s + b.amount, 0);

  return (
    <Card className="spending-breakdown">
      <div className="spending-breakdown__header">
        <h3 className="chart-title">Spending Breakdown</h3>
        <p className="chart-subtitle">By category</p>
      </div>

      <div className="spending-breakdown__chart">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="amount"
              strokeWidth={2}
              stroke="var(--color-surface)"
              animationBegin={200} animationDuration={1400} animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip cursor={false} content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="spending-breakdown__center">
          <span className="spending-breakdown__total-label">Total</span>
          <span className="spending-breakdown__total-value">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="spending-breakdown__legend">
        {breakdown.slice(0, 6).map(item => (
          <div key={item.category} className="legend-item">
            <span
              className="legend-dot"
              style={{ background: getCategoryColor(item.category) }}
            />
            <span className="legend-label">{item.label}</span>
            <span className="legend-value">{item.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
