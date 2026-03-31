/**
 * Format amount in INR (Indian Rupee) format with proper commas
 * e.g., 15000 => "15,000.00"
 */
export function formatINR(amount) {
  const num = Math.abs(amount);
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatted;
}

/**
 * Format date to readable string
 * e.g., "28 Mar, 6:45 PM"
 */
export function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('en-IN', { month: 'short' });
  const time = date.toLocaleString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${day} ${month}, ${time}`;
}

/**
 * Format full date for details page
 * e.g., "28 March 2026, 6:45:00 PM"
 */
export function formatFullDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Get date group label
 * e.g., "Today", "Yesterday", "25 Mar 2026"
 */
export function getDateGroup(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) return 'Today';
  if (dateOnly.getTime() === yesterdayOnly.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Group transactions by date
 */
export function groupTransactionsByDate(transactions) {
  const groups = {};
  transactions.forEach((txn) => {
    const group = getDateGroup(txn.date);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(txn);
  });
  return groups;
}
