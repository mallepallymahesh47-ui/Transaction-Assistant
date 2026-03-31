export default function BalanceCard() {
  return (
    <div className="balance-card">
      <div className="balance-label">Available Balance</div>
      <div className="balance-amount">
        <span className="currency">₹</span>24,850.75
      </div>
      <div className="balance-meta">
        <span className="balance-bank">HDFC Bank ••1847</span>
        <span className="dot" style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}></span>
        <span className="balance-bank">Savings Account</span>
      </div>
    </div>
  );
}
