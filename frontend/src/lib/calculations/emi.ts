import Decimal from 'decimal.js';

Decimal.set({ precision: 20 });

export interface EMICalculationResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  monthlyInterestRate: number;
}

export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): EMICalculationResult {
  const P = new Decimal(principal);
  const r = new Decimal(annualInterestRate).div(12).div(100);
  const n = new Decimal(tenureMonths);

  if (r.isZero()) {
    const emi = P.div(n).toNumber();
    return {
      emi: Math.round(emi),
      totalInterest: 0,
      totalAmount: principal,
      monthlyInterestRate: 0,
    };
  }

  const onePlusR = r.plus(1);
  const onePlusRPowerN = onePlusR.pow(n);

  const numerator = P.mul(r).mul(onePlusRPowerN);
  const denominator = onePlusRPowerN.minus(1);

  const emi = numerator.div(denominator);
  const emiRounded = Math.round(emi.toNumber());

  const totalAmount = emiRounded * tenureMonths;
  const totalInterest = totalAmount - principal;

  return {
    emi: emiRounded,
    totalInterest,
    totalAmount,
    monthlyInterestRate: r.toNumber(),
  };
}

export function generateAmortizationSchedule(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  startDate?: Date
): any[] {
  const { emi } = calculateEMI(principal, annualInterestRate, tenureMonths);
  const monthlyRate = new Decimal(annualInterestRate).div(12).div(100);

  let openingBalance = new Decimal(principal);
  let cumulativeInterest = new Decimal(0);
  let cumulativePrincipal = new Decimal(0);

  const schedule: any[] = [];
  const baseDate = startDate || new Date();

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = openingBalance.mul(monthlyRate);
    let principalComponent = new Decimal(emi).minus(interest);

    if (month === tenureMonths) {
      principalComponent = openingBalance;
    }

    const closingBalance = openingBalance.minus(principalComponent);
    cumulativeInterest = cumulativeInterest.plus(interest);
    cumulativePrincipal = cumulativePrincipal.plus(principalComponent);

    const interestPercentage = interest.div(emi).mul(100);
    const isBreakeven = principalComponent.greaterThan(interest);

    const monthDate = new Date(baseDate);
    monthDate.setMonth(monthDate.getMonth() + month - 1);

    schedule.push({
      monthNumber: month,
      monthYear: monthDate.toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      }),
      date: monthDate.toISOString().split('T')[0],
      openingBalance: Math.round(openingBalance.toNumber()),
      emiPaid: emi,
      interestComponent: Math.round(interest.toNumber()),
      principalComponent: Math.round(principalComponent.toNumber()),
      extraPayment: 0,
      totalPayment: emi,
      closingBalance: Math.round(closingBalance.toNumber()),
      interestPercentage: interestPercentage.toNumber(),
      cumulativeInterest: Math.round(cumulativeInterest.toNumber()),
      cumulativePrincipal: Math.round(cumulativePrincipal.toNumber()),
      isBreakeven,
    });

    openingBalance = closingBalance;
  }

  return schedule;
}

export function findBreakevenMonth(schedule: any[]): number {
  const breakevenRow = schedule.find((row) => row.isBreakeven);
  return breakevenRow ? breakevenRow.monthNumber : schedule.length;
}
