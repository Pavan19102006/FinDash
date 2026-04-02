import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCategoryLabel, getCategoryColor } from '../../data/categories';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import './TransactionTable.css';

const PAGE_SIZE = 10;

export default function TransactionTable({ transactions, onEdit }) {
  const { isAdmin, deleteTransaction, filters, setFilter } = useApp();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, currentPage]);

  function handleSort(field) {
    if (filters.sortField === field) {
      setFilter('sortDirection', filters.sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setFilter('sortField', field);
      setFilter('sortDirection', 'desc');
    }
    setCurrentPage(1);
  }

  function SortIndicator({ field }) {
    if (filters.sortField !== field) return null;
    return filters.sortDirection === 'desc'
      ? <ArrowDown size={13} />
      : <ArrowUp size={13} />;
  }

  return (
    <Card className="txn-table-card" animate={false}>
      <div className="txn-table-wrapper">
        <table className="txn-table">
          <thead>
            <tr>
              <th className="txn-th txn-th--sortable" onClick={() => handleSort('date')}>
                Date <SortIndicator field="date" />
              </th>
              <th className="txn-th txn-th--sortable" onClick={() => handleSort('description')}>
                Description <SortIndicator field="description" />
              </th>
              <th className="txn-th txn-th--sortable" onClick={() => handleSort('category')}>
                Category <SortIndicator field="category" />
              </th>
              <th className="txn-th">Type</th>
              <th className="txn-th txn-th--sortable txn-th--right" onClick={() => handleSort('amount')}>
                Amount <SortIndicator field="amount" />
              </th>
              {isAdmin && <th className="txn-th txn-th--right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginated.map(txn => (
              <tr key={txn.id} className="txn-row">
                <td className="txn-td txn-td--date">{formatDate(txn.date, 'MMM dd, yyyy')}</td>
                <td className="txn-td txn-td--desc">{txn.description}</td>
                <td className="txn-td">
                  <span className="txn-category-badge" style={{
                    background: `${getCategoryColor(txn.category)}14`,
                    color: getCategoryColor(txn.category),
                  }}>
                    {getCategoryLabel(txn.category)}
                  </span>
                </td>
                <td className="txn-td">
                  <span className={`txn-type-badge txn-type-badge--${txn.type}`}>
                    {txn.type}
                  </span>
                </td>
                <td className={`txn-td txn-td--right txn-td--amount ${txn.type === 'income' ? 'amount--income' : 'amount--expense'}`}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                </td>
                {isAdmin && (
                  <td className="txn-td txn-td--right txn-td--actions">
                    <button
                      className="txn-action-btn"
                      onClick={() => onEdit(txn)}
                      aria-label="Edit transaction"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="txn-action-btn txn-action-btn--danger"
                      onClick={() => deleteTransaction(txn.id)}
                      aria-label="Delete transaction"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="txn-pagination">
          <span className="txn-pagination__info">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, transactions.length)} of {transactions.length}
          </span>
          <div className="txn-pagination__controls">
            <button
              className="txn-pagination__btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (totalPages <= 5) return true;
                if (page === 1 || page === totalPages) return true;
                return Math.abs(page - currentPage) <= 1;
              })
              .reduce((acc, page, i, arr) => {
                if (i > 0 && page - arr[i - 1] > 1) {
                  acc.push('...');
                }
                acc.push(page);
                return acc;
              }, [])
              .map((item, i) =>
                item === '...' ? (
                  <span key={`ellipsis-${i}`} className="txn-pagination__ellipsis">…</span>
                ) : (
                  <button
                    key={item}
                    className={`txn-pagination__btn ${item === currentPage ? 'txn-pagination__btn--active' : ''}`}
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </button>
                )
            )}
            <button
              className="txn-pagination__btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
