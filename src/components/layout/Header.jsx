import { useApp } from '../../context/AppContext';
import { Menu, Sun, Moon, Shield, Eye, Lock } from 'lucide-react';
import './Header.css';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

export default function Header() {
  const { activePage, role, setRole, theme, toggleTheme, toggleSidebar } = useApp();

  return (
    <>
      {role === 'viewer' && (
        <div className="viewer-banner">
          <Lock size={13} />
          <span>View-Only Mode — You are viewing as a <strong>Viewer</strong>. Switch to Admin for full access.</span>
        </div>
      )}
      <header className={`header ${role === 'viewer' ? 'header--viewer' : ''}`}>
        <div className="header__left">
          <button className="header__menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
            <Menu size={22} />
          </button>
          <div>
            <h1 className="header__title">{PAGE_TITLES[activePage]}</h1>
            <p className="header__subtitle">
              {activePage === 'dashboard' && 'Your financial overview at a glance'}
              {activePage === 'transactions' && 'Manage and review your transactions'}
              {activePage === 'insights' && 'Understand your spending patterns'}
            </p>
          </div>
        </div>

        <div className="header__actions">
          <button
            className="header__theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="header__role-switch">
            <button
              className={`role-btn ${role === 'viewer' ? 'role-btn--active role-btn--viewer-active' : ''}`}
              onClick={() => setRole('viewer')}
            >
              <Eye size={14} />
              <span>Viewer</span>
            </button>
            <button
              className={`role-btn ${role === 'admin' ? 'role-btn--active role-btn--admin-active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <Shield size={14} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
