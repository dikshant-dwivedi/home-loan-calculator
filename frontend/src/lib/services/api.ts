import type { LoanParameters, PrepaymentAction } from '@/types';
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

interface PrepaymentComparison {
  tenureReduced: number;
  tenureReducedYears: number;
  interestSaved: number;
  totalSavings: number;
  totalExtraPaid: number;
  savingsPercentage: number;
  roi: number;
  breakevenShift: number;
}

interface PrepaymentSummaryItem {
  type: string;
  startMonth?: number;
  endMonth?: number;
  paymentMonth?: number;
  totalAmount: number;
  impact: {
    tenureReduced: number;
    interestSaved: number;
  };
}

interface CalculateWithPrepaymentsResponse {
  success: boolean;
  data: {
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
    comparison: PrepaymentComparison;
    prepaymentSummary: PrepaymentSummaryItem[];
    modifiedSchedule: AmortizationScheduleRow[];
  };
  message: string;
  timestamp: string;
}

interface WhatIfScenario {
  type: 'extra_monthly' | 'lumpsum' | 'rate_change';
  amount?: number;
  fromMonth?: number;
  toMonth?: number;
  rateChange?: number;
}

interface WhatIfResponse {
  success: boolean;
  data: {
    impact: {
      monthsSaved: number;
      interestSaved: number;
      newTenure: number;
      newEMI: number;
    };
    recommendation: string;
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

  async calculateWithPrepayments(
    loanParameters: LoanParameters,
    prepayments: PrepaymentAction[]
  ): Promise<CalculateWithPrepaymentsResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/loan/calculate-with-prepayments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loanParameters: {
          principal: loanParameters.principal,
          annualInterestRate: loanParameters.annualInterestRate,
          tenureMonths: loanParameters.tenureMonths,
          startDate: loanParameters.startDate?.toISOString().split('T')[0],
        },
        prepayments: prepayments.map(p => ({
          type: p.type,
          startMonth: p.startMonth,
          endMonth: p.endMonth,
          extraAmountPerMonth: p.extraAmountPerMonth,
          paymentMonth: p.paymentMonth,
          lumpsumAmount: p.lumpsumAmount,
          missedMonth: p.missedMonth,
          penaltyAmount: p.penaltyAmount,
          impactStrategy: p.impactStrategy,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to calculate with prepayments');
    }

    return response.json();
  },

  async calculateWhatIf(
    currentScenario: {
      principal: number;
      annualInterestRate: number;
      tenureMonths: number;
      currentMonth?: number;
      outstandingBalance?: number;
    },
    whatIf: WhatIfScenario
  ): Promise<WhatIfResponse> {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/loan/what-if`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentScenario,
        whatIf,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to calculate what-if scenario');
    }

    return response.json();
  },
};
