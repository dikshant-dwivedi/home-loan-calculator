'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { formatIndianCurrency } from '@/lib/utils/formatting';
import { apiClient } from '@/lib/services/api';

interface WhatIfPanelProps {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  currentMonth?: number;
  outstandingBalance?: number;
}

interface WhatIfResults {
  monthsSaved: number;
  interestSaved: number;
  newTenure: number;
  newEMI: number;
  recommendation: string;
}

export function WhatIfPanel({
  principal,
  annualInterestRate,
  tenureMonths,
  currentMonth = 1,
  outstandingBalance,
}: WhatIfPanelProps) {
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [lumpsumAmount, setLumpsumAmount] = useState(0);
  const [rateChange, setRateChange] = useState(0);
  const [activeScenario, setActiveScenario] = useState<'extra_monthly' | 'lumpsum' | 'rate_change'>('extra_monthly');
  const [results, setResults] = useState<WhatIfResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentScenario = {
        principal,
        annualInterestRate,
        tenureMonths,
        currentMonth,
        outstandingBalance: outstandingBalance || principal,
      };

      let whatIf;
      if (activeScenario === 'extra_monthly') {
        whatIf = {
          type: 'extra_monthly' as const,
          amount: extraMonthly,
          fromMonth: currentMonth + 1,
          toMonth: tenureMonths,
        };
      } else if (activeScenario === 'lumpsum') {
        whatIf = {
          type: 'lumpsum' as const,
          amount: lumpsumAmount,
          fromMonth: currentMonth + 1,
        };
      } else {
        whatIf = {
          type: 'rate_change' as const,
          rateChange,
        };
      }

      const response = await apiClient.calculateWhatIf(currentScenario, whatIf);
      setResults({
        ...response.data.impact,
        recommendation: response.data.recommendation,
      });
    } catch (err) {
      console.error('What-if calculation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate what-if scenario');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setResults(null);
  }, [activeScenario, extraMonthly, lumpsumAmount, rateChange]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">What-If Scenarios</h3>
        <p className="text-sm text-gray-600 mb-4">
          Quickly explore different prepayment strategies with interactive sliders
        </p>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveScenario('extra_monthly')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeScenario === 'extra_monthly'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Extra Monthly
        </button>
        <button
          onClick={() => setActiveScenario('lumpsum')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeScenario === 'lumpsum'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Lumpsum
        </button>
        <button
          onClick={() => setActiveScenario('rate_change')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeScenario === 'rate_change'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Rate Change
        </button>
      </div>

      <div className="space-y-6 pt-4">
        {activeScenario === 'extra_monthly' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Extra Monthly Payment</label>
              <span className="text-lg font-semibold text-blue-600">
                {formatIndianCurrency(extraMonthly)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={extraMonthly}
              onChange={(e) => setExtraMonthly(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹0</span>
              <span>₹1,00,000</span>
            </div>
          </div>
        )}

        {activeScenario === 'lumpsum' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Lumpsum Amount</label>
              <span className="text-lg font-semibold text-blue-600">
                {formatIndianCurrency(lumpsumAmount)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5000000"
              step="50000"
              value={lumpsumAmount}
              onChange={(e) => setLumpsumAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹0</span>
              <span>₹50,00,000</span>
            </div>
          </div>
        )}

        {activeScenario === 'rate_change' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Interest Rate Change</label>
              <span className="text-lg font-semibold text-blue-600">
                {rateChange > 0 ? '+' : ''}{rateChange.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={rateChange}
              onChange={(e) => setRateChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-2%</span>
              <span>0%</span>
              <span>+2%</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              New rate: {(annualInterestRate + rateChange).toFixed(2)}%
            </p>
          </div>
        )}

        <Button 
          onClick={handleCalculate} 
          className="w-full"
          disabled={isLoading || (activeScenario === 'extra_monthly' && extraMonthly === 0) || (activeScenario === 'lumpsum' && lumpsumAmount === 0)}
        >
          {isLoading ? 'Calculating...' : 'Calculate Impact'}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {results && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-gray-900">Impact Analysis</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Months Saved</div>
                <div className="text-2xl font-bold text-green-600">
                  {results.monthsSaved}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.floor(results.monthsSaved / 12)}y {results.monthsSaved % 12}m
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">Interest Saved</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatIndianCurrency(results.interestSaved)}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">New Tenure</div>
                <div className="text-xl font-semibold text-gray-900">
                  {results.newTenure} months
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.floor(results.newTenure / 12)}y {results.newTenure % 12}m
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-xs text-gray-600 mb-1">New EMI</div>
                <div className="text-xl font-semibold text-gray-900">
                  {formatIndianCurrency(results.newEMI)}
                </div>
              </div>
            </div>

            {results.recommendation && (
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600">
                <div className="text-xs font-medium text-gray-600 mb-1">Recommendation</div>
                <div className="text-sm text-gray-900">{results.recommendation}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
