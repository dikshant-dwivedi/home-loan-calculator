'use client';

import { useState, useMemo } from 'react';
import { formatIndianCurrency, formatPercentage } from '@/lib/utils/formatting';
import { Button } from '@/components/ui/button';

interface AmortizationRow {
  monthNumber: number;
  monthYear: string;
  date: string;
  openingBalance: number;
  emiPaid: number;
  interestComponent: number;
  principalComponent: number;
  extraPayment: number;
  totalPayment: number;
  closingBalance: number;
  interestPercentage: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
  isBreakeven: boolean;
}

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  breakevenMonth?: number;
}

export function AmortizationTable({ schedule, breakevenMonth }: AmortizationTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const filteredSchedule = useMemo(() => {
    let filtered = [...schedule];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (row) =>
          row.monthNumber.toString().includes(search) ||
          row.monthYear.toLowerCase().includes(search)
      );
    }

    if (yearFilter !== 'all') {
      filtered = filtered.filter((row) => row.monthYear.includes(yearFilter));
    }

    return filtered;
  }, [schedule, searchTerm, yearFilter]);

  const totalPages = Math.ceil(filteredSchedule.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredSchedule.slice(startIndex, endIndex);

  const years = useMemo(() => {
    const uniqueYears = new Set(
      schedule.map((row) => row.monthYear.split("'")[1] || row.monthYear.split(' ')[1])
    );
    return Array.from(uniqueYears).sort();
  }, [schedule]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const exportToCSV = () => {
    const headers = [
      'Month',
      'Date',
      'Opening Balance',
      'EMI',
      'Interest',
      'Principal',
      'Closing Balance',
      'Cumulative Interest',
    ];

    const csvContent = [
      headers.join(','),
      ...schedule.map((row) =>
        [
          row.monthNumber,
          row.monthYear,
          row.openingBalance,
          row.emiPaid,
          row.interestComponent,
          row.principalComponent,
          row.closingBalance,
          row.cumulativeInterest,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `amortization_schedule_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (schedule.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No amortization schedule available. Calculate your loan first!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold">Amortization Schedule</h2>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              Export CSV
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by month or date..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={12}>12 rows</option>
              <option value={24}>24 rows</option>
              <option value={60}>60 rows</option>
              <option value={120}>120 rows</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opening Balance
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                EMI
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interest
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Principal
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closing Balance
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Int %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((row) => {
              const isBreakevenRow = row.monthNumber === breakevenMonth;
              return (
                <tr
                  key={row.monthNumber}
                  className={`hover:bg-gray-50 transition-colors ${
                    isBreakevenRow ? 'bg-green-50 border-l-4 border-green-500' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {row.monthNumber}
                    {isBreakevenRow && (
                      <span className="ml-2 text-green-600" title="Breakeven Month">
                        ✓
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.monthYear}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right tabular-nums">
                    {formatIndianCurrency(row.openingBalance)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right tabular-nums">
                    {formatIndianCurrency(row.emiPaid)}
                  </td>
                  <td className="px-4 py-3 text-sm text-orange-600 text-right tabular-nums">
                    {formatIndianCurrency(row.interestComponent)}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 text-right tabular-nums">
                    {formatIndianCurrency(row.principalComponent)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right tabular-nums">
                    {formatIndianCurrency(row.closingBalance)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right tabular-nums">
                    {formatPercentage(row.interestPercentage, 1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredSchedule.length)} of{' '}
            {filteredSchedule.length} months
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              First
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
            <Button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
