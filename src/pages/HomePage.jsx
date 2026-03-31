import { useState, useMemo } from 'react';
import BalanceCard from '../components/BalanceCard';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import StatsRow from '../components/StatsRow';
import TransactionList from '../components/TransactionList';
import transactions from '../data/transactions.json';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (txn) =>
          txn.name.toLowerCase().includes(query) ||
          txn.note?.toLowerCase().includes(query) ||
          txn.upiId.toLowerCase().includes(query)
      );
    }

    // Apply status/type filter
    if (activeFilter !== 'all') {
      if (['success', 'failed', 'pending'].includes(activeFilter)) {
        result = result.filter((txn) => txn.status === activeFilter);
      } else if (['credit', 'debit'].includes(activeFilter)) {
        result = result.filter((txn) => txn.type === activeFilter);
      }
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    return result;
  }, [searchQuery, activeFilter]);

  return (
    <div className="app-container" id="home-page">
      {/* Header */}
      <header className="app-header">
        <div className="header-top">
          <div className="header-title-section">
            <div className="header-logo">
              <svg viewBox="0 0 24 24">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
            <div>
              <div className="header-title">My Payments</div>
              <div className="header-subtitle">Transaction History</div>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-action-btn" id="notifications-btn" aria-label="Notifications">
              <svg viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>
          </div>
        </div>
        <BalanceCard />
      </header>

      {/* Filters */}
      <div className="filters-section">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {/* Stats */}
      <StatsRow transactions={transactions} />

      {/* Transaction List */}
      <TransactionList transactions={filteredTransactions} />
    </div>
  );
}
