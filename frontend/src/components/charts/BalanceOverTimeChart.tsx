'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatIndianCurrency } from '@/lib/utils/formatting';

interface AmortizationRow {
  monthNumber: number;
  monthYear: string;
  closingBalance: number;
}

interface BalanceOverTimeChartProps {
  schedule: AmortizationRow[];
  breakevenMonth?: number;
}

export function BalanceOverTimeChart({ schedule, breakevenMonth }: BalanceOverTimeChartProps) {
  const chartData = schedule
    .filter((_, index) => index % 12 === 0 || index === schedule.length - 1)
    .map((row) => ({
      month: row.monthNumber,
      balance: row.closingBalance,
      label: row.monthYear,
    }));

  const maxBalance = Math.max(...chartData.map((d) => d.balance));
  const yAxisMax = Math.ceil(maxBalance / 1000000) * 1000000;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { month: number; balance: number; label: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">Month {data.month}</p>
          <p className="text-sm text-gray-700">{data.label}</p>
          <p className="text-sm font-semibold text-blue-600">
            Balance: {formatIndianCurrency(data.balance)}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(0)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)}L`;
    }
    return formatIndianCurrency(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Outstanding Balance Over Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
            />
            <YAxis
              tickFormatter={formatYAxis}
              label={{ value: 'Balance', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
              domain={[0, yAxisMax]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={() => 'Outstanding Balance'}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ fill: '#2563EB', r: 3 }}
              activeDot={{ r: 5 }}
              name="Outstanding Balance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {breakevenMonth && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-green-700">Breakeven Point:</span> Month{' '}
            {breakevenMonth} - After this point, you pay more principal than interest each month.
          </p>
        </div>
      )}
    </div>
  );
}
