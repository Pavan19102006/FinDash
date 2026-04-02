import { Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_CATEGORIES } from '../../data/categories';
import CustomSelect from '../common/CustomSelect';
import './TransactionFilters.css';

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...ALL_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label })),
];

export default function TransactionFilters() {
  const { filters, setFilter, resetFilters } = useApp();

  const hasActiveFilters =
    filters.search ||
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="txn-filters">
      <div className="txn-filters__search">
        <Search size={16} className="txn-filters__search-icon" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          className="txn-filters__input"
        />
      </div>

      <CustomSelect
        value={filters.type}
        onChange={val => setFilter('type', val)}
        options={TYPE_OPTIONS}
        placeholder="All Types"
      />

      <CustomSelect
        value={filters.category}
        onChange={val => setFilter('category', val)}
        options={CATEGORY_OPTIONS}
        placeholder="All Categories"
      />

      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => setFilter('dateFrom', e.target.value)}
        className="txn-filters__date"
        placeholder="From"
      />

      <input
        type="date"
        value={filters.dateTo}
        onChange={e => setFilter('dateTo', e.target.value)}
        className="txn-filters__date"
        placeholder="To"
      />

      {hasActiveFilters && (
        <button className="txn-filters__clear" onClick={resetFilters}>
          <X size={14} />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}
