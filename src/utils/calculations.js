import { parseISO, format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { getCategoryLabel } from '../data/categories';

export function computeSummary(transactions) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  return { income, expenses, balance, savingsRate };
}

export function computeMonthlyData(transactions, monthCount = 6) {
  const now = new Date();
  const months = [];

  // Start from previous month to avoid showing an empty current month
  for (let i = monthCount; i >= 1; i--) {
    const monthDate = subMonths(now, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const label = format(monthDate, 'MMM yyyy');
    const shortLabel = format(monthDate, 'MMM');

    const monthTxns = transactions.filter(t => {
      const d = parseISO(t.date);
      return isWithinInterval(d, { start, end });
    });

    const income = monthTxns
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);

    const expenses = monthTxns
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);

    months.push({
      label,
      shortLabel,
      income,
      expenses,
      balance: income - expenses,
      net: income - expenses,
    });
  }

  let runningBalance = 0;
  months.forEach(m => {
    runningBalance += m.net;
    m.cumulativeBalance = runningBalance;
  });

  return months;
}

export function computeCategoryBreakdown(transactions) {
  const expenseTxns = transactions.filter(t => t.type === 'expense');
  const grouped = {};

  expenseTxns.forEach(t => {
    if (!grouped[t.category]) {
      grouped[t.category] = 0;
    }
    grouped[t.category] += t.amount;
  });

  const total = Object.values(grouped).reduce((s, v) => s + v, 0);

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      label: getCategoryLabel(category),
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function computeInsights(transactions) {
  const breakdown = computeCategoryBreakdown(transactions);
  const monthlyData = computeMonthlyData(transactions);

  const highestCategory = breakdown[0] || null;
  const lowestCategory = breakdown[breakdown.length - 1] || null;

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  let monthOverMonthChange = null;
  if (currentMonth && previousMonth && previousMonth.expenses > 0) {
    monthOverMonthChange = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;
  }

  const avgMonthlyExpense = monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length;
  const avgMonthlyIncome = monthlyData.reduce((s, m) => s + m.income, 0) / monthlyData.length;

  const topRecurring = findRecurringExpenses(transactions);

  return {
    highestCategory,
    lowestCategory,
    monthOverMonthChange,
    currentMonth,
    previousMonth,
    avgMonthlyExpense,
    avgMonthlyIncome,
    monthlyData,
    breakdown,
    topRecurring,
  };
}

function findRecurringExpenses(transactions) {
  const descCount = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const key = t.description.toLowerCase();
      if (!descCount[key]) {
        descCount[key] = { description: t.description, count: 0, totalAmount: 0, category: t.category };
      }
      descCount[key].count++;
      descCount[key].totalAmount += t.amount;
    });

  return Object.values(descCount)
    .filter(item => item.count >= 2)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);
}

export function filterTransactions(transactions, filters) {
  let result = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }

  if (filters.type && filters.type !== 'all') {
    result = result.filter(t => t.type === filters.type);
  }

  if (filters.category && filters.category !== 'all') {
    result = result.filter(t => t.category === filters.category);
  }

  if (filters.dateFrom) {
    result = result.filter(t => t.date >= filters.dateFrom);
  }

  if (filters.dateTo) {
    result = result.filter(t => t.date <= filters.dateTo);
  }

  const sortField = filters.sortField || 'date';
  const sortDir = filters.sortDirection || 'desc';

  result.sort((a, b) => {
    let cmp = 0;
    if (sortField === 'date') {
      cmp = a.date.localeCompare(b.date);
    } else if (sortField === 'amount') {
      cmp = a.amount - b.amount;
    } else if (sortField === 'description') {
      cmp = a.description.localeCompare(b.description);
    } else if (sortField === 'category') {
      cmp = a.category.localeCompare(b.category);
    }
    return sortDir === 'desc' ? -cmp : cmp;
  });

  return result;
}

export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [
    t.date,
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount.toFixed(2),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
