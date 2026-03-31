import { useParams, useNavigate } from 'react-router-dom';
import transactions from '../data/transactions.json';
import { formatINR, formatFullDateTime } from '../utils/formatters';

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const txn = transactions.find((t) => t.id === id);

  if (!txn) {
    return (
      <div className="app-container details-page">
        <div className="details-header">
          <button className="back-btn" onClick={() => navigate(-1)} id="back-btn">
            <svg viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <div className="details-header-title">Transaction Details</div>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            </svg>
          </div>
          <div className="empty-state-title">Transaction not found</div>
          <div className="empty-state-text">This transaction does not exist</div>
        </div>
      </div>
    );
  }

  const isCredit = txn.type === 'credit';

  const statusIcons = {
    success: (
      <svg viewBox="0 0 24 24" fill="#00c853">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
    failed: (
      <svg viewBox="0 0 24 24" fill="#ff3d00">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    ),
    pending: (
      <svg viewBox="0 0 24 24" fill="#ff9800">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </svg>
    ),
  };

  const statusLabels = {
    success: 'Payment Successful',
    failed: 'Payment Failed',
    pending: 'Payment Pending',
  };

  return (
    <div className="app-container details-page page-enter" id="details-page">
      {/* Header Bar */}
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)} id="back-btn">
          <svg viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <div className="details-header-title">Transaction Details</div>
      </div>

      {/* Status Hero */}
      <div className="details-hero">
        <div className={`details-status-icon ${txn.status}`}>
          {statusIcons[txn.status]}
        </div>
        <div className="details-amount">
          <span className="currency">₹</span>{formatINR(txn.amount)}
        </div>
        <div className={`details-status-text ${txn.status}`}>
          {statusLabels[txn.status]}
        </div>
        <div className="details-recipient">
          {isCredit ? `Received from ${txn.name}` : `Paid to ${txn.name}`}
        </div>
      </div>

      {/* Details Body */}
      <div className="details-body">
        {/* Transaction Info */}
        <div className="details-card fade-in-up">
          <div className="details-card-title">Transaction Information</div>
          <div className="details-row">
            <span className="details-row-label">Transaction ID</span>
            <span className="details-row-value">{txn.id}</span>
          </div>
          <div className="details-row">
            <span className="details-row-label">Date & Time</span>
            <span className="details-row-value">{formatFullDateTime(txn.date)}</span>
          </div>
          <div className="details-row">
            <span className="details-row-label">UPI Reference</span>
            <span className="details-row-value">{txn.bankRef}</span>
          </div>
          <div className="details-row">
            <span className="details-row-label">Status</span>
            <span className={`details-row-value status-${txn.status}`} style={{ fontWeight: 700 }}>
              {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="details-card fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="details-card-title">Payment Details</div>
          <div className="details-row">
            <span className="details-row-label">{isCredit ? 'Sender UPI ID' : 'Receiver UPI ID'}</span>
            <span className="details-row-value">{txn.upiId}</span>
          </div>
          <div className="details-row">
            <span className="details-row-label">Payment Method</span>
            <span className="details-row-value">{txn.paymentMethod}</span>
          </div>
          <div className="details-row">
            <span className="details-row-label">{isCredit ? 'Credited To' : 'Debited From'}</span>
            <span className="details-row-value">{txn.fromAccount}</span>
          </div>
          {txn.note && (
            <div className="details-row">
              <span className="details-row-label">Note</span>
              <span className="details-row-value">{txn.note}</span>
            </div>
          )}
        </div>

        {/* Amount Breakdown */}
        <div className="details-card fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="details-card-title">Amount Breakdown</div>
          <div className="details-row">
            <span className="details-row-label">Transaction Amount</span>
            <span className="details-row-value">₹{formatINR(txn.amount)}</span>
          </div>
          <div className="details-row">
            <span className="details-row-label">Convenience Fee</span>
            <span className="details-row-value" style={{ color: 'var(--accent-green)' }}>FREE</span>
          </div>
          <div className="details-row">
            <span className="details-row-label">GST</span>
            <span className="details-row-value">₹0.00</span>
          </div>
          <div className="details-row" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '4px' }}>
            <span className="details-row-label" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Total Amount
            </span>
            <span className="details-row-value" style={{ fontSize: '1.05rem' }}>
              ₹{formatINR(txn.amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
