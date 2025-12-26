'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatIndianCurrency } from '@/lib/utils/formatting';

interface PaymentBreakdownChartProps {
  totalPrincipal: number;
  totalInterest: number;
}

const COLORS = {
  principal: '#10B981',
  interest: '#F59E0B',
};

export function PaymentBreakdownChart({ totalPrincipal, totalInterest }: PaymentBreakdownChartProps) {
  const data = [
    { name: 'Principal', value: totalPrincipal, color: COLORS.principal },
    { name: 'Interest', value: totalInterest, color: COLORS.interest },
  ];

  const totalAmount = totalPrincipal + totalInterest;
  const principalPercentage = ((totalPrincipal / totalAmount) * 100).toFixed(1);
  const interestPercentage = ((totalInterest / totalAmount) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalAmount) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-700">{formatIndianCurrency(data.value)}</p>
          <p className="text-xs text-gray-500">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: { value: number }) => {
    const percentage = ((entry.value / totalAmount) * 100).toFixed(1);
    return `${percentage}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => {
                const item = data.find((d) => d.name === value);
                if (item) {
                  const percentage = ((item.value / totalAmount) * 100).toFixed(1);
                  return `${value}: ${formatIndianCurrency(item.value)} (${percentage}%)`;
                }
                return value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-gray-600 text-xs">Principal Amount</p>
          <p className="font-semibold text-green-700 tabular-nums">
            {formatIndianCurrency(totalPrincipal)}
          </p>
          <p className="text-xs text-gray-500">{principalPercentage}% of total</p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-gray-600 text-xs">Total Interest</p>
          <p className="font-semibold text-orange-700 tabular-nums">
            {formatIndianCurrency(totalInterest)}
          </p>
          <p className="text-xs text-gray-500">{interestPercentage}% of total</p>
        </div>
      </div>
    </div>
  );
}
