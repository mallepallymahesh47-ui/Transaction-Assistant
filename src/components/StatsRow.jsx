import { formatINR } from '../utils/formatters';

export default function StatsRow({ transactions }) {
  const totalCredit = transactions
    .filter((t) => t.type === 'credit' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === 'debit' && t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTxns = transactions.length;

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Received</div>
        <div className="stat-value credit">₹{formatINR(totalCredit)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Sent</div>
        <div className="stat-value debit">₹{formatINR(totalDebit)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total</div>
        <div className="stat-value">{totalTxns}</div>
      </div>
    </div>
  );
}
