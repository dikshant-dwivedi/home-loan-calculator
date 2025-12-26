'use client';

import { useState } from 'react';
import { LoanForm } from '@/components/calculator/LoanForm';
import { ResultsSummary } from '@/components/calculator/ResultsSummary';
import { AmortizationTable } from '@/components/calculator/AmortizationTable';
import { PaymentBreakdownChart } from '@/components/charts/PaymentBreakdownChart';
import { BalanceOverTimeChart } from '@/components/charts/BalanceOverTimeChart';
import { PrepaymentPanel } from '@/components/prepayment/PrepaymentPanel';
import { WhatIfPanel } from '@/components/prepayment/WhatIfPanel';
import { ComparisonView } from '@/components/prepayment/ComparisonView';
import { calculateEMI, generateAmortizationSchedule, findBreakevenMonth } from '@/lib/calculations/emi';
import { apiClient } from '@/lib/services/api';
import type { LoanParametersFormData } from '@/lib/utils/validation';
import type { PrepaymentAction, LoanParameters } from '@/types';

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

interface CalculationResults {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  breakevenMonth: number;
  tenure: number;
  principal: number;
  schedule: AmortizationRow[];
  source: 'local' | 'api';
}

interface PrepaymentResults {
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
  modifiedSchedule: AmortizationRow[];
}

export default function Home() {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [loanParams, setLoanParams] = useState<LoanParameters | null>(null);
  const [prepayments, setPrepayments] = useState<PrepaymentAction[]>([]);
  const [prepaymentResults, setPrepaymentResults] = useState<PrepaymentResults | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'prepayment' | 'whatif'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [isPrepaymentLoading, setIsPrepaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useApi, setUseApi] = useState(true);

  const handleCalculate = async (data: LoanParametersFormData) => {
    setIsLoading(true);
    setError(null);

    const params: LoanParameters = {
      principal: data.principal,
      annualInterestRate: data.annualInterestRate,
      tenureMonths: data.tenureMonths,
      startDate: data.startDate,
    };
    setLoanParams(params);

    try {
      if (useApi) {
        const response = await apiClient.calculateLoan(params);

        setResults({
          emi: response.data.calculation.emi,
          totalInterest: response.data.calculation.totalInterest,
          totalAmount: response.data.calculation.totalAmount,
          breakevenMonth: response.data.calculation.breakevenMonth,
          tenure: data.tenureMonths,
          principal: data.principal,
          schedule: response.data.amortizationSchedule,
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
          principal: data.principal,
          schedule: schedule,
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
        principal: data.principal,
        schedule: schedule,
        source: 'local',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculateWithPrepayments = async () => {
    if (!loanParams || prepayments.length === 0) return;

    setIsPrepaymentLoading(true);
    setError(null);

    try {
      const response = await apiClient.calculateWithPrepayments(loanParams, prepayments);
      setPrepaymentResults({
        original: response.data.original,
        modified: response.data.modified,
        comparison: response.data.comparison,
        modifiedSchedule: response.data.modifiedSchedule,
      });
    } catch (err) {
      console.error('Prepayment calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate with prepayments');
    } finally {
      setIsPrepaymentLoading(false);
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
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <ResultsSummary
                    emi={results.emi}
                    totalInterest={results.totalInterest}
                    totalAmount={results.totalAmount}
                    breakevenMonth={results.breakevenMonth}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                  <div className="border-b">
                    <div className="flex gap-1 p-1">
                      <button
                        onClick={() => setActiveTab('basic')}
                        className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          activeTab === 'basic'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        📊 Basic Analysis
                      </button>
                      <button
                        onClick={() => setActiveTab('prepayment')}
                        className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          activeTab === 'prepayment'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        💰 Prepayment Strategy
                      </button>
                      <button
                        onClick={() => setActiveTab('whatif')}
                        className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          activeTab === 'whatif'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        🔮 What-If Scenarios
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {activeTab === 'basic' && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <PaymentBreakdownChart
                            totalPrincipal={results.principal}
                            totalInterest={results.totalInterest}
                          />
                          <BalanceOverTimeChart
                            schedule={results.schedule}
                            breakevenMonth={results.breakevenMonth}
                          />
                        </div>

                        <AmortizationTable
                          schedule={results.schedule}
                          breakevenMonth={results.breakevenMonth}
                        />
                      </div>
                    )}

                    {activeTab === 'prepayment' && loanParams && (
                      <div className="space-y-6">
                        <PrepaymentPanel
                          prepayments={prepayments}
                          onPrepaymentsChange={setPrepayments}
                          maxTenure={loanParams.tenureMonths}
                        />

                        {prepayments.length > 0 && (
                          <div className="flex justify-center pt-4">
                            <button
                              onClick={handleCalculateWithPrepayments}
                              disabled={isPrepaymentLoading}
                              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                              {isPrepaymentLoading ? 'Calculating...' : 'Calculate Impact'}
                            </button>
                          </div>
                        )}

                        {prepaymentResults && (
                          <div className="space-y-6 pt-6 border-t">
                            <ComparisonView metrics={prepaymentResults} />
                            
                            <div>
                              <h4 className="font-semibold mb-4">Modified Amortization Schedule</h4>
                              <AmortizationTable
                                schedule={prepaymentResults.modifiedSchedule}
                                breakevenMonth={prepaymentResults.modified.breakevenMonth}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'whatif' && loanParams && (
                      <WhatIfPanel
                        principal={loanParams.principal}
                        annualInterestRate={loanParams.annualInterestRate}
                        tenureMonths={loanParams.tenureMonths}
                      />
                    )}
                  </div>
                </div>
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
