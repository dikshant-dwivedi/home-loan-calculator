export interface AmortizationRow {
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

export interface LoanCalculation {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  monthlyInterestRate: number;
  breakevenMonth: number;
}

export interface LoanParameters {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  startDate: string;
}

export interface CalculateLoanResponse {
  loanParameters: LoanParameters;
  calculation: LoanCalculation;
  amortizationSchedule: AmortizationRow[];
}

export enum PrepaymentType {
  PERIODIC_EXTRA = 'periodic_extra',
  LUMPSUM = 'lumpsum',
  MISSED_PAYMENT = 'missed_payment',
}

export enum ImpactStrategy {
  REDUCE_TENURE = 'reduce_tenure',
  REDUCE_EMI = 'reduce_emi',
}

export interface PrepaymentAction {
  type: PrepaymentType;
  startMonth?: number;
  endMonth?: number;
  extraAmountPerMonth?: number;
  paymentMonth?: number;
  lumpsumAmount?: number;
  missedMonth?: number;
  penaltyAmount?: number;
  impactStrategy?: ImpactStrategy;
}

export interface OriginalLoanSummary {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  tenure: number;
  breakevenMonth: number;
}

export interface ModifiedLoanSummary {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  tenure: number;
  breakevenMonth: number;
  finalEMI: number;
}

export interface LoanComparison {
  tenureReduced: number;
  tenureReducedYears: number;
  interestSaved: number;
  totalSavings: number;
  totalExtraPaid: number;
  savingsPercentage: number;
  roi: number;
  breakevenShift: number;
}

export interface PrepaymentSummaryItem {
  type: PrepaymentType;
  startMonth?: number;
  endMonth?: number;
  paymentMonth?: number;
  totalAmount: number;
  impact: {
    tenureReduced: number;
    interestSaved: number;
  };
}

export interface CalculateWithPrepaymentsResponse {
  original: OriginalLoanSummary;
  modified: ModifiedLoanSummary;
  comparison: LoanComparison;
  prepaymentSummary: PrepaymentSummaryItem[];
  modifiedSchedule: AmortizationRow[];
}

export interface WhatIfScenario {
  type: 'extra_monthly' | 'lumpsum' | 'rate_change';
  amount?: number;
  fromMonth?: number;
  toMonth?: number;
  newRate?: number;
}

export interface CurrentScenario {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  currentMonth: number;
  outstandingBalance: number;
}

export interface WhatIfImpact {
  monthsSaved: number;
  interestSaved: number;
  newTenure: number;
  newEMI: number;
}

export interface WhatIfResponse {
  impact: WhatIfImpact;
  recommendation: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: boolean;
  error: ApiError;
  timestamp: string;
}
