import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories';
import Modal from '../common/Modal';
import './TransactionForm.css';

const EMPTY_FORM = {
  description: '',
  amount: '',
  category: '',
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
};

export default function TransactionForm({ isOpen, onClose, transaction }) {
  const { addTransaction, updateTransaction } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const isEditing = !!transaction;
  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: String(transaction.amount),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [transaction, isOpen]);

  function handleChange(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'type') {
        next.category = '';
      }
      return next;
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }

  function validate() {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      errs.amount = 'Enter a valid positive amount';
    }
    if (!form.category) errs.category = 'Select a category';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      ...form,
      amount: parseFloat(Number(form.amount).toFixed(2)),
    };

    if (isEditing) {
      updateTransaction({ ...payload, id: transaction.id });
    } else {
      addTransaction(payload);
    }
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'New Transaction'}
    >
      <form className="txn-form" onSubmit={handleSubmit}>
        <div className="txn-form__field">
          <label className="txn-form__label">Type</label>
          <div className="txn-form__type-toggle">
            <button
              type="button"
              className={`type-toggle-btn ${form.type === 'expense' ? 'type-toggle-btn--active type-toggle-btn--expense' : ''}`}
              onClick={() => handleChange('type', 'expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${form.type === 'income' ? 'type-toggle-btn--active type-toggle-btn--income' : ''}`}
              onClick={() => handleChange('type', 'income')}
            >
              Income
            </button>
          </div>
        </div>

        <div className="txn-form__field">
          <label className="txn-form__label" htmlFor="txn-desc">Description</label>
          <input
            id="txn-desc"
            type="text"
            className={`txn-form__input ${errors.description ? 'txn-form__input--error' : ''}`}
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="e.g., Grocery Store"
          />
          {errors.description && <span className="txn-form__error">{errors.description}</span>}
        </div>

        <div className="txn-form__row">
          <div className="txn-form__field">
            <label className="txn-form__label" htmlFor="txn-amount">Amount</label>
            <input
              id="txn-amount"
              type="number"
              step="0.01"
              min="0"
              className={`txn-form__input ${errors.amount ? 'txn-form__input--error' : ''}`}
              value={form.amount}
              onChange={e => handleChange('amount', e.target.value)}
              placeholder="0.00"
            />
            {errors.amount && <span className="txn-form__error">{errors.amount}</span>}
          </div>

          <div className="txn-form__field">
            <label className="txn-form__label" htmlFor="txn-date">Date</label>
            <input
              id="txn-date"
              type="date"
              className={`txn-form__input ${errors.date ? 'txn-form__input--error' : ''}`}
              value={form.date}
              onChange={e => handleChange('date', e.target.value)}
            />
            {errors.date && <span className="txn-form__error">{errors.date}</span>}
          </div>
        </div>

        <div className="txn-form__field">
          <label className="txn-form__label" htmlFor="txn-category">Category</label>
          <select
            id="txn-category"
            className={`txn-form__input ${errors.category ? 'txn-form__input--error' : ''}`}
            value={form.category}
            onChange={e => handleChange('category', e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.category && <span className="txn-form__error">{errors.category}</span>}
        </div>

        <div className="txn-form__actions">
          <button type="button" className="btn btn--outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn--primary">
            {isEditing ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
