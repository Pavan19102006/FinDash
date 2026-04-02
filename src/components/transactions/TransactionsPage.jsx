import { useMemo, useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { filterTransactions, exportToCSV } from '../../utils/calculations';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import TransactionForm from './TransactionForm';
import EmptyState from '../common/EmptyState';
import './TransactionsPage.css';

export default function TransactionsPage() {
  const { transactions, filters, isAdmin } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);

  const filtered = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters]
  );

  function handleEdit(txn) {
    setEditingTxn(txn);
    setFormOpen(true);
  }

  function handleAdd() {
    setEditingTxn(null);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditingTxn(null);
  }

  return (
    <div className="transactions-page animate-fade-in">
      <div className="transactions-page__toolbar">
        <TransactionFilters />
        <div className="transactions-page__actions">
          <button className="btn btn--outline" onClick={() => exportToCSV(filtered)}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          {isAdmin && (
            <button className="btn btn--primary" onClick={handleAdd}>
              <Plus size={16} />
              <span>Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No transactions found"
          message="Try changing your filters or add a new transaction."
        />
      ) : (
        <TransactionTable transactions={filtered} onEdit={handleEdit} />
      )}

      <TransactionForm
        isOpen={formOpen}
        onClose={handleCloseForm}
        transaction={editingTxn}
      />
    </div>
  );
}
