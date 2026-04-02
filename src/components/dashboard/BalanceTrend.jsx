import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { computeMonthlyData } from '../../utils/calculations';
import { formatCompactCurrency } from '../../utils/formatters';
import Card from '../common/Card';
import './BalanceTrend.css';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map(entry => (
        <div key={entry.dataKey} className="chart-tooltip__row">
          <span
            className="chart-tooltip__dot"
            style={{ background: entry.color }}
          />
          <span className="chart-tooltip__name">{entry.name}</span>
          <span className="chart-tooltip__value">{formatCompactCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function BalanceTrend() {
  const { transactions, theme } = useApp();
  const data = useMemo(() => computeMonthlyData(transactions), [transactions]);

  const gridColor = theme === 'dark' ? '#2a2d3e' : '#eef1f6';
  const textColor = theme === 'dark' ? '#6b6f8d' : '#8e92a8';

  return (
    <Card className="balance-trend">
      <div className="balance-trend__header">
        <div>
          <h3 className="chart-title">Balance Trend</h3>
          <p className="chart-subtitle">Income vs Expenses over 6 months</p>
        </div>
      </div>
      <div className="balance-trend__chart">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="shortLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12 }}
              tickFormatter={v => formatCompactCurrency(v)}
            />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#incomeGradient)"
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              animationBegin={200} animationDuration={1500} animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fill="url(#expenseGradient)"
              dot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
              animationBegin={500} animationDuration={1500} animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
