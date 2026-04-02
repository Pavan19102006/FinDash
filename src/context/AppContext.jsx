import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { DEFAULT_TRANSACTIONS } from '../data/mockTransactions';

const STORAGE_KEY = 'findash_state';

const AppContext = createContext(null);

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        transactions: parsed.transactions || DEFAULT_TRANSACTIONS,
        role: parsed.role || 'admin',
        theme: parsed.theme || 'light',
      };
    }
  } catch {
    // Swallow parse errors and fall through to defaults
  }
  return null;
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions: state.transactions,
      role: state.role,
      theme: state.theme,
    }));
  } catch {
    // Storage full or unavailable
  }
}

const initialFilters = {
  search: '',
  type: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  sortField: 'date',
  sortDirection: 'desc',
};

function buildInitialState() {
  const stored = loadFromStorage();
  return {
    transactions: stored?.transactions || DEFAULT_TRANSACTIONS,
    role: stored?.role || 'admin',
    theme: stored?.theme || 'light',
    activePage: 'dashboard',
    filters: { ...initialFilters },
    sidebarOpen: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, activePage: action.payload, sidebarOpen: false };

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, [action.field]: action.value } };

    case 'RESET_FILTERS':
      return { ...state, filters: { ...initialFilters } };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, buildInitialState);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    saveToStorage(state);
  }, [state.transactions, state.role, state.theme]);

  const setPage = useCallback((page) => dispatch({ type: 'SET_PAGE', payload: page }), []);
  const setRole = useCallback((role) => dispatch({ type: 'SET_ROLE', payload: role }), []);
  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);
  const setFilter = useCallback((field, value) => dispatch({ type: 'SET_FILTER', field, value }), []);
  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const closeSidebar = useCallback(() => dispatch({ type: 'CLOSE_SIDEBAR' }), []);

  const addTransaction = useCallback((txn) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: { ...txn, id: Math.random().toString(36).substring(2, 10) },
    });
  }, []);

  const updateTransaction = useCallback((txn) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: txn });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }, []);

  const value = {
    ...state,
    dispatch,
    setPage,
    setRole,
    toggleTheme,
    setFilter,
    resetFilters,
    toggleSidebar,
    closeSidebar,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isAdmin: state.role === 'admin',
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
