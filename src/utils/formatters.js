import { format, parseISO, isValid } from 'date-fns';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function formatCompactCurrency(amount) {
  return compactFormatter.format(amount);
}

export function formatDate(dateStr, pattern = 'MMM dd, yyyy') {
  const parsed = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return isValid(parsed) ? format(parsed, pattern) : dateStr;
}

export function formatPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}
