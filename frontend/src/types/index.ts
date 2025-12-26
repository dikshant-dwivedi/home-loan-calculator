export interface LoanParameters {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  startDate?: Date;
}

export interface AmortizationRow {
  monthNumber: number;
  monthYear: string;
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
  id: string;
  type: PrepaymentType;
  startMonth?: number;
  endMonth?: number;
  extraAmountPerMonth?: number;
  paymentMonth?: number;
  lumpsumAmount?: number;
  missedMonth?: number;
  penaltyAmount?: number;
  impactStrategy: ImpactStrategy;
}

export interface CalculationResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  amortizationSchedule: AmortizationRow[];
  breakevenMonth: number;
  prepaymentSummary?: {
    totalExtraPaid: number;
    tenureReduced: number;
    interestSaved: number;
    newEMI?: number;
    newTenure: number;
  };
}
