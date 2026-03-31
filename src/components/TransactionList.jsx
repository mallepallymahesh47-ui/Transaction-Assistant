import TransactionItem from './TransactionItem';
import { groupTransactionsByDate } from '../utils/formatters';

export default function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg viewBox="0 0 24 24">
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        </div>
        <div className="empty-state-title">No transactions found</div>
        <div className="empty-state-text">Try adjusting your filters or search query</div>
      </div>
    );
  }

  const grouped = groupTransactionsByDate(transactions);

  return (
    <div className="transaction-section">
      {Object.entries(grouped).map(([dateLabel, txns]) => (
        <div className="transaction-date-group" key={dateLabel}>
          <div className="date-header">{dateLabel}</div>
          {txns.map((txn, i) => (
            <TransactionItem key={txn.id} transaction={txn} index={i} />
          ))}
        </div>
      ))}
    </div>
  );
}
