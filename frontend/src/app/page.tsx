'use client';

import { useState } from 'react';
import { LoanForm } from '@/components/calculator/LoanForm';
import { ResultsSummary } from '@/components/calculator/ResultsSummary';
import { calculateEMI, generateAmortizationSchedule, findBreakevenMonth } from '@/lib/calculations/emi';
import { apiClient } from '@/lib/services/api';
import type { LoanParametersFormData } from '@/lib/utils/validation';

interface CalculationResults {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  breakevenMonth: number;
  tenure: number;
  source: 'local' | 'api';
}

export default function Home() {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useApi, setUseApi] = useState(true);

  const handleCalculate = async (data: LoanParametersFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (useApi) {
        const response = await apiClient.calculateLoan({
          principal: data.principal,
          annualInterestRate: data.annualInterestRate,
          tenureMonths: data.tenureMonths,
          startDate: data.startDate,
        });

        setResults({
          emi: response.data.calculation.emi,
          totalInterest: response.data.calculation.totalInterest,
          totalAmount: response.data.calculation.totalAmount,
          breakevenMonth: response.data.calculation.breakevenMonth,
          tenure: data.tenureMonths,
          source: 'api',
        });
      } else {
        const localCalc = calculateEMI(
          data.principal,
          data.annualInterestRate,
          data.tenureMonths
        );
        const schedule = generateAmortizationSchedule(
          data.principal,
          data.annualInterestRate,
          data.tenureMonths,
          data.startDate
        );
        const breakeven = findBreakevenMonth(schedule);

        setResults({
          emi: localCalc.emi,
          totalInterest: localCalc.totalInterest,
          totalAmount: localCalc.totalAmount,
          breakevenMonth: breakeven,
          tenure: data.tenureMonths,
          source: 'local',
        });
      }
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate loan');
      
      const localCalc = calculateEMI(
        data.principal,
        data.annualInterestRate,
        data.tenureMonths
      );
      const schedule = generateAmortizationSchedule(
        data.principal,
        data.annualInterestRate,
        data.tenureMonths,
        data.startDate
      );
      const breakeven = findBreakevenMonth(schedule);

      setResults({
        emi: localCalc.emi,
        totalInterest: localCalc.totalInterest,
        totalAmount: localCalc.totalAmount,
        breakevenMonth: breakeven,
        tenure: data.tenureMonths,
        source: 'local',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Home Loan Calculator</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <LoanForm onSubmit={handleCalculate} isLoading={isLoading} />
              
              <div className="mt-6 pt-6 border-t">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useApi}
                    onChange={(e) => setUseApi(e.target.checked)}
                    className="rounded"
                  />
                  <span>Use Backend API</span>
                </label>
                {results && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last calculation: {results.source === 'api' ? 'Backend API' : 'Client-side'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600">⚠️</div>
                  <div>
                    <div className="font-semibold text-yellow-900">API Error</div>
                    <div className="text-sm text-yellow-700 mt-1">{error}</div>
                    <div className="text-xs text-yellow-600 mt-2">
                      Fallback: Using client-side calculation
                    </div>
                  </div>
                </div>
              </div>
            )}

            {results ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <ResultsSummary
                  emi={results.emi}
                  totalInterest={results.totalInterest}
                  totalAmount={results.totalAmount}
                  breakevenMonth={results.breakevenMonth}
                  tenure={results.tenure}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Calculate Your Home Loan
                </h2>
                <p className="text-gray-600">
                  Enter your loan details on the left to see EMI breakdown and savings potential
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
