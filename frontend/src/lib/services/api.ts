import type { LoanParameters } from '@/types';
import type { AmortizationScheduleRow } from '@/lib/calculations/emi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const API_PREFIX = '/api/v1';

interface CalculateResponse {
  success: boolean;
  data: {
    loanParameters: LoanParameters;
    calculation: {
      emi: number;
      totalInterest: number;
      totalAmount: number;
      monthlyInterestRate: number;
      breakevenMonth: number;
    };
    amortizationSchedule: AmortizationScheduleRow[];
  };
  message: string;
  timestamp: string;
}

export const apiClient = {
  baseURL: API_BASE_URL,

  async calculateLoan(params: LoanParameters): Promise<CalculateResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/loan/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        principal: params.principal,
        annualInterestRate: params.annualInterestRate,
        tenureMonths: params.tenureMonths,
        startDate: params.startDate?.toISOString().split('T')[0],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to calculate loan');
    }

    return response.json();
  },
};
