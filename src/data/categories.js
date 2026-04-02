export const CATEGORIES = {
  salary: { label: 'Salary', color: '#6366f1', type: 'income' },
  freelance: { label: 'Freelance', color: '#8b5cf6', type: 'income' },
  investment: { label: 'Investment', color: '#06b6d4', type: 'income' },
  refund: { label: 'Refund', color: '#14b8a6', type: 'income' },
  housing: { label: 'Housing', color: '#f43f5e', type: 'expense' },
  food: { label: 'Food & Dining', color: '#f97316', type: 'expense' },
  transport: { label: 'Transport', color: '#eab308', type: 'expense' },
  shopping: { label: 'Shopping', color: '#ec4899', type: 'expense' },
  entertainment: { label: 'Entertainment', color: '#a855f7', type: 'expense' },
  healthcare: { label: 'Healthcare', color: '#10b981', type: 'expense' },
  utilities: { label: 'Utilities', color: '#3b82f6', type: 'expense' },
  education: { label: 'Education', color: '#0ea5e9', type: 'expense' },
  subscriptions: { label: 'Subscriptions', color: '#6366f1', type: 'expense' },
  other: { label: 'Other', color: '#64748b', type: 'expense' },
};

export const EXPENSE_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([, v]) => v.type === 'expense')
  .map(([key, v]) => ({ value: key, label: v.label }));

export const INCOME_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([, v]) => v.type === 'income')
  .map(([key, v]) => ({ value: key, label: v.label }));

export const ALL_CATEGORIES = Object.entries(CATEGORIES)
  .map(([key, v]) => ({ value: key, label: v.label, type: v.type }));

export function getCategoryColor(key) {
  return CATEGORIES[key]?.color || '#64748b';
}

export function getCategoryLabel(key) {
  return CATEGORIES[key]?.label || key;
}
