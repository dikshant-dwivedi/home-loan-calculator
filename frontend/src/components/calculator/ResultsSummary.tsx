'use client';

import { formatIndianCurrency } from '@/lib/utils/formatting';

interface ResultsSummaryProps {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  breakevenMonth: number;
}

export function ResultsSummary({
  emi,
  totalInterest,
  totalAmount,
  breakevenMonth,
}: ResultsSummaryProps) {
  const breakevenYears = Math.floor(breakevenMonth / 12);
  const breakevenMonths = breakevenMonth % 12;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Loan Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-2">Monthly EMI</div>
          <div className="text-3xl font-bold text-blue-600 tabular-nums">
            {formatIndianCurrency(emi)}
          </div>
          <div className="text-xs text-gray-500 mt-2">Every month</div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-2">Total Interest</div>
          <div className="text-3xl font-bold text-orange-600 tabular-nums">
            {formatIndianCurrency(totalInterest)}
          </div>
          <p className="text-sm text-gray-600">
            After this month, you&apos;ll pay more principal than interest
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="text-sm text-gray-600 mb-2">Total Amount</div>
          <div className="text-3xl font-bold text-gray-900 tabular-nums">
            {formatIndianCurrency(totalAmount)}
          </div>
          <div className="text-xs text-gray-500 mt-2">Principal + Interest</div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚖️</div>
          <div>
            <div className="font-semibold text-blue-900">
              Breakeven Month: Month {breakevenMonth}
            </div>
            <div className="text-sm text-blue-700 mt-1">
              After {breakevenYears} years{breakevenMonths > 0 && ` ${breakevenMonths} months`}, you&apos;ll pay more principal than interest
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
