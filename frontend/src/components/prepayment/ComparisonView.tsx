'use client';

import { formatIndianCurrency } from '@/lib/utils/formatting';

interface ComparisonMetrics {
  original: {
    emi: number;
    totalInterest: number;
    totalAmount: number;
    tenure: number;
    breakevenMonth: number;
  };
  modified: {
    emi: number;
    totalInterest: number;
    totalAmount: number;
    tenure: number;
    breakevenMonth: number;
    finalEMI: number;
  };
  comparison: {
    tenureReduced: number;
    tenureReducedYears: number;
    interestSaved: number;
    totalSavings: number;
    totalExtraPaid: number;
    savingsPercentage: number;
    roi: number;
    breakevenShift: number;
  };
}

interface ComparisonViewProps {
  metrics: ComparisonMetrics;
}

export function ComparisonView({ metrics }: ComparisonViewProps) {
  const { original, modified, comparison } = metrics;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Before vs After Comparison</h3>
        <p className="text-sm text-gray-600">
          See how prepayments impact your loan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="text-sm font-medium text-green-800 mb-2">💰 Interest Saved</div>
          <div className="text-3xl font-bold text-green-700">
            {formatIndianCurrency(comparison.interestSaved)}
          </div>
          <div className="text-xs text-green-600 mt-2">
            {comparison.savingsPercentage.toFixed(1)}% of original interest
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="text-sm font-medium text-blue-800 mb-2">⏱️ Tenure Reduced</div>
          <div className="text-3xl font-bold text-blue-700">
            {comparison.tenureReduced} months
          </div>
          <div className="text-xs text-blue-600 mt-2">
            {comparison.tenureReducedYears} years {comparison.tenureReduced % 12} months earlier
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
          <div className="text-sm font-medium text-purple-800 mb-2">📈 ROI</div>
          <div className="text-3xl font-bold text-purple-700">
            {comparison.roi.toFixed(1)}%
          </div>
          <div className="text-xs text-purple-600 mt-2">
            Return on prepayment investment
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 border-b">
          <div className="px-4 py-3 text-sm font-semibold text-gray-700">Metric</div>
          <div className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Original</div>
          <div className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">With Prepayments</div>
        </div>

        <div className="divide-y">
          <div className="grid grid-cols-3 hover:bg-gray-50">
            <div className="px-4 py-3 text-sm font-medium text-gray-900">EMI</div>
            <div className="px-4 py-3 text-sm text-gray-700 text-center tabular-nums">
              {formatIndianCurrency(original.emi)}
            </div>
            <div className="px-4 py-3 text-sm text-gray-700 text-center tabular-nums">
              {formatIndianCurrency(modified.emi)}
              {modified.emi !== original.emi && (
                <span className="ml-2 text-xs text-green-600">
                  ({modified.emi < original.emi ? '-' : '+'}{formatIndianCurrency(Math.abs(modified.emi - original.emi))})
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 hover:bg-gray-50">
            <div className="px-4 py-3 text-sm font-medium text-gray-900">Total Interest</div>
            <div className="px-4 py-3 text-sm text-gray-700 text-center tabular-nums">
              {formatIndianCurrency(original.totalInterest)}
            </div>
            <div className="px-4 py-3 text-sm text-center tabular-nums">
              <span className="text-green-700 font-semibold">{formatIndianCurrency(modified.totalInterest)}</span>
              <span className="ml-2 text-xs text-green-600">
                (-{formatIndianCurrency(comparison.interestSaved)})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 hover:bg-gray-50">
            <div className="px-4 py-3 text-sm font-medium text-gray-900">Total Amount</div>
            <div className="px-4 py-3 text-sm text-gray-700 text-center tabular-nums">
              {formatIndianCurrency(original.totalAmount)}
            </div>
            <div className="px-4 py-3 text-sm text-center tabular-nums">
              <span className="text-green-700 font-semibold">{formatIndianCurrency(modified.totalAmount)}</span>
              <span className="ml-2 text-xs text-green-600">
                (-{formatIndianCurrency(comparison.totalSavings)})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 hover:bg-gray-50">
            <div className="px-4 py-3 text-sm font-medium text-gray-900">Tenure</div>
            <div className="px-4 py-3 text-sm text-gray-700 text-center tabular-nums">
              {original.tenure} months
              <span className="text-xs text-gray-500 ml-1">
                ({Math.floor(original.tenure / 12)}y {original.tenure % 12}m)
              </span>
            </div>
            <div className="px-4 py-3 text-sm text-center tabular-nums">
              <span className="text-green-700 font-semibold">
                {modified.tenure} months
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({Math.floor(modified.tenure / 12)}y {modified.tenure % 12}m)
              </span>
              <span className="ml-2 text-xs text-green-600">
                (-{comparison.tenureReduced} months)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 hover:bg-gray-50">
            <div className="px-4 py-3 text-sm font-medium text-gray-900">Breakeven Month</div>
            <div className="px-4 py-3 text-sm text-gray-700 text-center tabular-nums">
              Month {original.breakevenMonth}
            </div>
            <div className="px-4 py-3 text-sm text-center tabular-nums">
              <span className={modified.breakevenMonth < original.breakevenMonth ? 'text-green-700 font-semibold' : 'text-gray-700'}>
                Month {modified.breakevenMonth}
              </span>
              {comparison.breakevenShift !== 0 && (
                <span className="ml-2 text-xs text-green-600">
                  ({comparison.breakevenShift} months earlier)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-xl">💡</div>
          <div className="flex-1">
            <div className="font-semibold text-blue-900 text-sm mb-1">Summary</div>
            <div className="text-sm text-blue-800">
              By paying an extra <strong>{formatIndianCurrency(comparison.totalExtraPaid)}</strong> over time,
              you'll save <strong>{formatIndianCurrency(comparison.interestSaved)}</strong> in interest
              and finish your loan <strong>{comparison.tenureReducedYears} years {comparison.tenureReduced % 12} months</strong> earlier.
              That's a <strong>{comparison.roi.toFixed(1)}%</strong> return on your prepayment investment!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
