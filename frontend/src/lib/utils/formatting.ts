export function formatIndianCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return amount < 0 ? `-₹${formatted}` : `₹${formatted}`;
}

export function parseIndianCurrency(value: string): number {
  const cleaned = value.replace(/[₹,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatMonthYear(date: Date, monthOffset: number): string {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + monthOffset);
  return newDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}
