import { Link } from 'react-router-dom';
import { formatINR, formatDateTime } from '../utils/formatters';

export default function TransactionItem({ transaction, index }) {
  const { id, name, avatar, amount, type, date, status, paymentMethod, note } = transaction;

  const isCredit = type === 'credit';
  const prefix = isCredit ? '+' : '-';

  return (
    <Link
      to={`/transaction/${id}`}
      className="transaction-item"
      style={{ animationDelay: `${(index % 10) * 0.02}s` }}
      id={`txn-${id}`}
    >
      <div className={`transaction-avatar ${isCredit ? 'avatar-credit' : 'avatar-debit'}`}>
        {avatar}
      </div>

      <div className="transaction-info">
        <div className="transaction-name">{name}</div>
        <div className="transaction-meta">
          <span className="transaction-time">{formatDateTime(date)}</span>
          <span className="transaction-method">{paymentMethod}</span>
        </div>
        {note && <div className="transaction-note">{note}</div>}
      </div>

      <div className="transaction-amount-section">
        <div className={`transaction-amount ${isCredit ? 'amount-credit' : 'amount-debit'}`}>
          {prefix} ₹{formatINR(amount)}
        </div>
        <div className={`transaction-status status-${status}`}>
          {status === 'success' && '✓ Success'}
          {status === 'failed' && '✕ Failed'}
          {status === 'pending' && '● Pending'}
        </div>
      </div>
    </Link>
  );
}
