# FinDash — Personal Finance Dashboard

A clean, interactive finance dashboard built with React for tracking and understanding financial activity. Features real-time visualizations, transaction management with role-based access, and spending insights.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
to access the live version https://findash-07.vercel.app access here in your browser 

## Features

### Dashboard Overview
- **Summary Cards** — Total Balance, Income, Expenses, and Savings Rate with trend indicators
- **Balance Trend** — Area chart comparing income vs expenses across the last 6 months
- **Spending Breakdown** — Donut chart categorizing expenses with percentage legend
- **Recent Transactions** — Quick-view of the 5 most recent transactions

### Transaction Management
- Sortable table with columns for date, description, category, type, and amount
- Search by description or category
- Filter by transaction type, category, and date range
- Pagination with smart ellipsis for large datasets
- CSV export of filtered results
- Add, edit, and delete transactions (Admin role only)

### Insights & Analytics
- Highest and lowest spending categories
- Month-over-month spending change percentage
- Average monthly income and expense calculations
- Monthly income vs expense bar chart comparison
- Horizontal category breakdown chart (top 6)
- Recurring expense detection with occurrence count

### Role-Based UI
Two roles are simulated via a segmented control in the header:
- **Viewer** — Read-only access; action buttons (add/edit/delete) are hidden
- **Admin** — Full CRUD capabilities on transactions

Switching roles is instant and persisted to localStorage.

### Theming
- **Light mode** (default)
- **Dark mode** — toggle via the sun/moon icon in the header
- Theme preference is persisted across sessions

### Data Persistence
All state (transactions, role, theme) is saved to `localStorage` and restored on page load. This means added/edited/deleted transactions survive browser refreshes.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite |
| Charts | Recharts |
| Icons | Lucide React |
| Date Utilities | date-fns |
| Styling | Vanilla CSS with Custom Properties |
| State Management | React Context + useReducer |
| Persistence | localStorage |

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI primitives (Card, Modal, EmptyState)
│   ├── dashboard/       # Dashboard page and sub-components
│   ├── insights/        # Insights page with analytics charts
│   ├── layout/          # App shell (Sidebar, Header, Layout)
│   └── transactions/    # Transaction table, filters, and form
├── context/
│   └── AppContext.jsx   # Global state provider with useReducer
├── data/
│   ├── categories.js    # Category definitions, colors, and helpers
│   └── mockTransactions.js  # 86 realistic transactions (Oct 2025 – Mar 2026)
├── utils/
│   ├── calculations.js  # Aggregation, filtering, insights, CSV export
│   └── formatters.js    # Currency, date, and percentage formatting
├── App.jsx              # Root component with page routing
├── index.css            # Design system tokens, reset, animations
└── main.jsx             # Entry point
```

## Design Approach

The UI uses a design token system via CSS custom properties for consistent spacing, typography, colors, shadows, and border radii. Both light and dark themes share the same structural styles — only color tokens are swapped via the `[data-theme]` attribute on `<html>`.

Key design decisions:
- **Inter** font family for modern, legible typography
- Subtle hover micro-animations on cards and table rows
- Color-coded category badges and type indicators
- Glassmorphism header with backdrop blur
- Responsive layout: sidebar collapses to a drawer on mobile

## Responsive Design

The layout adapts across three breakpoints:
- **Desktop** (>1024px) — Full sidebar + 4-column summary grid
- **Tablet** (768–1024px) — 2-column grids, stacked chart rows
- **Mobile** (<768px) — Sidebar becomes a slide-out drawer, single-column layout

## Build

```bash
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```
