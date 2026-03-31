const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'success', label: 'Success' },
  { key: 'failed', label: 'Failed' },
  { key: 'pending', label: 'Pending' },
  { key: 'credit', label: 'Received' },
  { key: 'debit', label: 'Sent' },
];

export default function FilterChips({ activeFilter, onFilterChange }) {
  return (
    <div className="filter-chips">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          className={`filter-chip ${activeFilter === filter.key ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.key)}
          id={`filter-${filter.key}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
