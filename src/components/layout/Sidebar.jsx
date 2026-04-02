import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  ChevronLeft,
  Wallet,
  Shield,
  Lock,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
  const { activePage, setPage, sidebarOpen, closeSidebar, role } = useApp();

  return (
    <>
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <Wallet size={22} />
          </div>
          <span className="sidebar__title">FinDash</span>
          <button className="sidebar__close" onClick={closeSidebar} aria-label="Close sidebar">
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar__link ${active ? 'sidebar__link--active' : ''}`}
                onClick={() => setPage(item.id)}
              >
                <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <div className={`sidebar__role-badge sidebar__role-badge--${role}`}>
            {role === 'admin' ? <Shield size={14} /> : <Lock size={14} />}
            <span>{role === 'admin' ? 'Admin Access' : 'View Only'}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
