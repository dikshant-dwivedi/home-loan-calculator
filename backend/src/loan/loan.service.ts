import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { CalculateLoanDto } from './dto/calculate-loan.dto';
import {
  CalculateWithPrepaymentsDto,
  PrepaymentDto,
} from './dto/calculate-with-prepayments.dto';
import { WhatIfDto, WhatIfType } from './dto/what-if.dto';
import {
  AmortizationRow,
  CalculateLoanResponse,
  CalculateWithPrepaymentsResponse,
  ImpactStrategy,
  LoanCalculation,
  ModifiedLoanSummary,
  OriginalLoanSummary,
  PrepaymentSummaryItem,
  PrepaymentType,
  WhatIfResponse,
} from './interfaces/calculation-result.interface';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

@Injectable()
export class LoanService {
  calculateEMI(
    principal: number,
    annualInterestRate: number,
    tenureMonths: number,
  ): number {
    if (annualInterestRate === 0) {
      return Math.round(principal / tenureMonths);
    }

    const P = new Decimal(principal);
    const r = new Decimal(annualInterestRate).div(12).div(100);
    const n = new Decimal(tenureMonths);

    const onePlusR = r.plus(1);
    const onePlusRPowerN = onePlusR.pow(n);

    const numerator = P.mul(r).mul(onePlusRPowerN);
    const denominator = onePlusRPowerN.minus(1);

    const emi = numerator.div(denominator);

    return Math.round(emi.toNumber());
  }

  private formatMonthYear(startDate: string | undefined, monthNumber: number): string {
    const date = startDate ? new Date(startDate) : new Date();
    date.setMonth(date.getMonth() + monthNumber - 1);
    
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  private formatDate(startDate: string | undefined, monthNumber: number): string {
    const date = startDate ? new Date(startDate) : new Date();
    date.setMonth(date.getMonth() + monthNumber - 1);
    return date.toISOString().split('T')[0];
  }

  generateAmortizationSchedule(
    principal: number,
    annualInterestRate: number,
    tenureMonths: number,
    startDate?: string,
  ): AmortizationRow[] {
    const emi = this.calculateEMI(principal, annualInterestRate, tenureMonths);
    const monthlyRate = new Decimal(annualInterestRate).div(12).div(100);

    let openingBalance = new Decimal(principal);
    let cumulativeInterest = new Decimal(0);
    let cumulativePrincipal = new Decimal(0);

    const schedule: AmortizationRow[] = [];

    for (let month = 1; month <= tenureMonths; month++) {
      const interest = openingBalance.mul(monthlyRate);
      let principalComponent = new Decimal(emi).minus(interest);

      if (month === tenureMonths || openingBalance.lessThanOrEqualTo(principalComponent)) {
        principalComponent = openingBalance;
      }

      const closingBalance = openingBalance.minus(principalComponent);
      cumulativeInterest = cumulativeInterest.plus(interest);
      cumulativePrincipal = cumulativePrincipal.plus(principalComponent);

      const interestPercentage = new Decimal(emi).gt(0)
        ? interest.div(emi).mul(100)
        : new Decimal(0);
      const isBreakeven = principalComponent.greaterThan(interest);

      schedule.push({
        monthNumber: month,
        monthYear: this.formatMonthYear(startDate, month),
        date: this.formatDate(startDate, month),
        openingBalance: Math.round(openingBalance.toNumber()),
        emiPaid: emi,
        interestComponent: Math.round(interest.toNumber()),
        principalComponent: Math.round(principalComponent.toNumber()),
        extraPayment: 0,
        totalPayment: emi,
        closingBalance: Math.max(0, Math.round(closingBalance.toNumber())),
        interestPercentage: Number(interestPercentage.toFixed(2)),
        cumulativeInterest: Math.round(cumulativeInterest.toNumber()),
        cumulativePrincipal: Math.round(cumulativePrincipal.toNumber()),
        isBreakeven,
      });

      if (closingBalance.lessThanOrEqualTo(0)) {
        break;
      }

      openingBalance = closingBalance;
    }

    return schedule;
  }

  private findBreakevenMonth(schedule: AmortizationRow[]): number {
    for (const row of schedule) {
      if (row.isBreakeven) {
        return row.monthNumber;
      }
    }
    return schedule.length;
  }

  calculateLoan(dto: CalculateLoanDto): CalculateLoanResponse {
    const { principal, annualInterestRate, tenureMonths, startDate } = dto;
    const actualStartDate = startDate || new Date().toISOString().split('T')[0];

    const emi = this.calculateEMI(principal, annualInterestRate, tenureMonths);
    const amortizationSchedule = this.generateAmortizationSchedule(
      principal,
      annualInterestRate,
      tenureMonths,
      actualStartDate,
    );

    const totalInterest = amortizationSchedule.reduce(
      (sum, row) => sum + row.interestComponent,
      0,
    );
    const totalAmount = principal + totalInterest;
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const breakevenMonth = this.findBreakevenMonth(amortizationSchedule);

    const calculation: LoanCalculation = {
      emi,
      totalInterest,
      totalAmount,
      monthlyInterestRate: Number(monthlyInterestRate.toFixed(8)),
      breakevenMonth,
    };

    return {
      loanParameters: {
        principal,
        annualInterestRate,
        tenureMonths,
        startDate: actualStartDate,
      },
      calculation,
      amortizationSchedule,
    };
  }

  calculateWithPrepayments(
    dto: CalculateWithPrepaymentsDto,
  ): CalculateWithPrepaymentsResponse {
    const { loanParameters, prepayments } = dto;
    const { principal, annualInterestRate, tenureMonths, startDate } = loanParameters;
    const actualStartDate = startDate || new Date().toISOString().split('T')[0];

    const originalEMI = this.calculateEMI(principal, annualInterestRate, tenureMonths);
    const originalSchedule = this.generateAmortizationSchedule(
      principal,
      annualInterestRate,
      tenureMonths,
      actualStartDate,
    );

    const originalTotalInterest = originalSchedule.reduce(
      (sum, row) => sum + row.interestComponent,
      0,
    );
    const originalBreakeven = this.findBreakevenMonth(originalSchedule);

    const original: OriginalLoanSummary = {
      emi: originalEMI,
      totalInterest: originalTotalInterest,
      totalAmount: principal + originalTotalInterest,
      tenure: tenureMonths,
      breakevenMonth: originalBreakeven,
    };

    const { modifiedSchedule, prepaymentSummary, totalExtraPaid } =
      this.applyPrepayments(
        principal,
        annualInterestRate,
        tenureMonths,
        actualStartDate,
        prepayments,
      );

    const modifiedTotalInterest = modifiedSchedule.reduce(
      (sum, row) => sum + row.interestComponent,
      0,
    );
    const modifiedTenure = modifiedSchedule.length;
    const modifiedBreakeven = this.findBreakevenMonth(modifiedSchedule);
    const finalEMI =
      modifiedSchedule.length > 0
        ? modifiedSchedule[modifiedSchedule.length - 1].emiPaid
        : originalEMI;

    const modified: ModifiedLoanSummary = {
      emi: originalEMI,
      totalInterest: modifiedTotalInterest,
      totalAmount: principal + modifiedTotalInterest + totalExtraPaid,
      tenure: modifiedTenure,
      breakevenMonth: modifiedBreakeven,
      finalEMI,
    };

    const tenureReduced = tenureMonths - modifiedTenure;
    const interestSaved = originalTotalInterest - modifiedTotalInterest;

    return {
      original,
      modified,
      comparison: {
        tenureReduced,
        tenureReducedYears: Number((tenureReduced / 12).toFixed(1)),
        interestSaved,
        totalSavings: interestSaved,
        totalExtraPaid,
        savingsPercentage: Number(
          ((interestSaved / originalTotalInterest) * 100).toFixed(2),
        ),
        roi:
          totalExtraPaid > 0
            ? Number(((interestSaved / totalExtraPaid) * 100).toFixed(2))
            : 0,
        breakevenShift: modifiedBreakeven - originalBreakeven,
      },
      prepaymentSummary,
      modifiedSchedule,
    };
  }

  private applyPrepayments(
    principal: number,
    annualInterestRate: number,
    tenureMonths: number,
    startDate: string,
    prepayments: PrepaymentDto[],
  ): {
    modifiedSchedule: AmortizationRow[];
    prepaymentSummary: PrepaymentSummaryItem[];
    totalExtraPaid: number;
  } {
    const monthlyRate = new Decimal(annualInterestRate).div(12).div(100);
    let currentEMI = this.calculateEMI(principal, annualInterestRate, tenureMonths);
    let openingBalance = new Decimal(principal);
    let cumulativeInterest = new Decimal(0);
    let cumulativePrincipal = new Decimal(0);

    const modifiedSchedule: AmortizationRow[] = [];
    const prepaymentSummary: PrepaymentSummaryItem[] = [];
    let totalExtraPaid = 0;

    const sortedPrepayments = [...prepayments].sort((a, b) => {
      const monthA = a.startMonth || a.paymentMonth || a.missedMonth || 0;
      const monthB = b.startMonth || b.paymentMonth || b.missedMonth || 0;
      return monthA - monthB;
    });

    const prepaymentMap = new Map<number, PrepaymentDto[]>();
    for (const p of sortedPrepayments) {
      if (p.type === PrepaymentType.PERIODIC_EXTRA && p.startMonth && p.endMonth) {
        for (let m = p.startMonth; m <= p.endMonth; m++) {
          if (!prepaymentMap.has(m)) prepaymentMap.set(m, []);
          prepaymentMap.get(m)!.push(p);
        }
      } else if (p.type === PrepaymentType.LUMPSUM && p.paymentMonth) {
        if (!prepaymentMap.has(p.paymentMonth)) prepaymentMap.set(p.paymentMonth, []);
        prepaymentMap.get(p.paymentMonth)!.push(p);
      } else if (p.type === PrepaymentType.MISSED_PAYMENT && p.missedMonth) {
        if (!prepaymentMap.has(p.missedMonth)) prepaymentMap.set(p.missedMonth, []);
        prepaymentMap.get(p.missedMonth)!.push(p);
      }
    }

    const trackedPrepayments = new Map<PrepaymentDto, { totalAmount: number; interestBefore: number }>();
    for (const p of prepayments) {
      trackedPrepayments.set(p, { totalAmount: 0, interestBefore: 0 });
    }

    for (let month = 1; month <= tenureMonths * 2; month++) {
      if (openingBalance.lessThanOrEqualTo(0)) break;

      const interest = openingBalance.mul(monthlyRate);
      let principalComponent = new Decimal(currentEMI).minus(interest);
      let extraPayment = new Decimal(0);
      let isMissedPayment = false;

      const monthPrepayments = prepaymentMap.get(month) || [];

      for (const p of monthPrepayments) {
        if (p.type === PrepaymentType.MISSED_PAYMENT) {
          isMissedPayment = true;
          const penalty = new Decimal(p.penaltyAmount || 0);
          openingBalance = openingBalance.plus(penalty);
        } else if (p.type === PrepaymentType.PERIODIC_EXTRA) {
          const extra = new Decimal(p.extraAmountPerMonth || 0);
          extraPayment = extraPayment.plus(extra);
          const tracker = trackedPrepayments.get(p)!;
          tracker.totalAmount += extra.toNumber();
        } else if (p.type === PrepaymentType.LUMPSUM) {
          const lumpsum = new Decimal(p.lumpsumAmount || 0);
          extraPayment = extraPayment.plus(lumpsum);
          const tracker = trackedPrepayments.get(p)!;
          tracker.totalAmount += lumpsum.toNumber();
        }
      }

      if (isMissedPayment) {
        const closingBalance = openingBalance;
        modifiedSchedule.push({
          monthNumber: month,
          monthYear: this.formatMonthYear(startDate, month),
          date: this.formatDate(startDate, month),
          openingBalance: Math.round(openingBalance.toNumber()),
          emiPaid: 0,
          interestComponent: 0,
          principalComponent: 0,
          extraPayment: 0,
          totalPayment: 0,
          closingBalance: Math.round(closingBalance.toNumber()),
          interestPercentage: 0,
          cumulativeInterest: Math.round(cumulativeInterest.toNumber()),
          cumulativePrincipal: Math.round(cumulativePrincipal.toNumber()),
          isBreakeven: false,
        });
        continue;
      }

      const totalPrincipalPayment = principalComponent.plus(extraPayment);
      const actualPrincipalPayment = Decimal.min(totalPrincipalPayment, openingBalance);
      const closingBalance = openingBalance.minus(actualPrincipalPayment);

      cumulativeInterest = cumulativeInterest.plus(interest);
      cumulativePrincipal = cumulativePrincipal.plus(actualPrincipalPayment);
      totalExtraPaid += extraPayment.toNumber();

      const totalPayment = currentEMI + extraPayment.toNumber();
      const interestPercentage = new Decimal(currentEMI).gt(0)
        ? interest.div(currentEMI).mul(100)
        : new Decimal(0);
      const isBreakeven = actualPrincipalPayment.greaterThan(interest);

      modifiedSchedule.push({
        monthNumber: month,
        monthYear: this.formatMonthYear(startDate, month),
        date: this.formatDate(startDate, month),
        openingBalance: Math.round(openingBalance.toNumber()),
        emiPaid: currentEMI,
        interestComponent: Math.round(interest.toNumber()),
        principalComponent: Math.round(actualPrincipalPayment.toNumber()),
        extraPayment: Math.round(extraPayment.toNumber()),
        totalPayment: Math.round(totalPayment),
        closingBalance: Math.max(0, Math.round(closingBalance.toNumber())),
        interestPercentage: Number(interestPercentage.toFixed(2)),
        cumulativeInterest: Math.round(cumulativeInterest.toNumber()),
        cumulativePrincipal: Math.round(cumulativePrincipal.toNumber()),
        isBreakeven,
      });

      if (closingBalance.lessThanOrEqualTo(0)) break;

      for (const p of monthPrepayments) {
        if (
          p.impactStrategy === ImpactStrategy.REDUCE_EMI &&
          ((p.type === PrepaymentType.PERIODIC_EXTRA && p.endMonth === month) ||
            p.type === PrepaymentType.LUMPSUM)
        ) {
          const remainingMonths = tenureMonths - month;
          if (remainingMonths > 0 && closingBalance.gt(0)) {
            currentEMI = this.calculateEMI(
              closingBalance.toNumber(),
              annualInterestRate,
              remainingMonths,
            );
          }
        }
      }

      openingBalance = closingBalance;
    }

    const modifiedTotalInterest = modifiedSchedule.reduce(
      (sum, row) => sum + row.interestComponent,
      0,
    );

    for (const p of prepayments) {
      const tracker = trackedPrepayments.get(p)!;
      if (tracker.totalAmount > 0) {
        const summary: PrepaymentSummaryItem = {
          type: p.type as PrepaymentType,
          totalAmount: tracker.totalAmount,
          impact: {
            tenureReduced: 0,
            interestSaved: 0,
          },
        };

        if (p.type === PrepaymentType.PERIODIC_EXTRA) {
          summary.startMonth = p.startMonth;
          summary.endMonth = p.endMonth;
        } else if (p.type === PrepaymentType.LUMPSUM) {
          summary.paymentMonth = p.paymentMonth;
        }

        prepaymentSummary.push(summary);
      }
    }

    return { modifiedSchedule, prepaymentSummary, totalExtraPaid };
  }

  calculateWhatIf(dto: WhatIfDto): WhatIfResponse {
    const { currentScenario, whatIf } = dto;
    const { principal, annualInterestRate, tenureMonths, currentMonth, outstandingBalance } =
      currentScenario;

    const originalEMI = this.calculateEMI(principal, annualInterestRate, tenureMonths);
    const remainingMonths = tenureMonths - currentMonth;

    const originalRemainingSchedule = this.generateAmortizationSchedule(
      outstandingBalance,
      annualInterestRate,
      remainingMonths,
    );
    const originalRemainingInterest = originalRemainingSchedule.reduce(
      (sum, row) => sum + row.interestComponent,
      0,
    );

    let modifiedSchedule: AmortizationRow[];
    let newEMI = originalEMI;

    if (whatIf.type === WhatIfType.EXTRA_MONTHLY) {
      const fromMonth = whatIf.fromMonth || currentMonth + 1;
      const toMonth = whatIf.toMonth || tenureMonths;
      const extraAmount = whatIf.amount || 0;

      const prepayments: PrepaymentDto[] = [
        {
          type: PrepaymentType.PERIODIC_EXTRA,
          startMonth: 1,
          endMonth: toMonth - currentMonth,
          extraAmountPerMonth: extraAmount,
          impactStrategy: ImpactStrategy.REDUCE_TENURE,
        },
      ];

      const result = this.applyPrepayments(
        outstandingBalance,
        annualInterestRate,
        remainingMonths,
        new Date().toISOString().split('T')[0],
        prepayments,
      );
      modifiedSchedule = result.modifiedSchedule;
    } else if (whatIf.type === WhatIfType.LUMPSUM) {
      const lumpsumMonth = whatIf.lumpsumMonth || 1;
      const lumpsumAmount = whatIf.amount || 0;

      const prepayments: PrepaymentDto[] = [
        {
          type: PrepaymentType.LUMPSUM,
          paymentMonth: lumpsumMonth,
          lumpsumAmount: lumpsumAmount,
          impactStrategy: ImpactStrategy.REDUCE_TENURE,
        },
      ];

      const result = this.applyPrepayments(
        outstandingBalance,
        annualInterestRate,
        remainingMonths,
        new Date().toISOString().split('T')[0],
        prepayments,
      );
      modifiedSchedule = result.modifiedSchedule;
    } else if (whatIf.type === WhatIfType.RATE_CHANGE) {
      const newRate = whatIf.newRate || annualInterestRate;
      newEMI = this.calculateEMI(outstandingBalance, newRate, remainingMonths);
      modifiedSchedule = this.generateAmortizationSchedule(
        outstandingBalance,
        newRate,
        remainingMonths,
      );
    } else {
      modifiedSchedule = originalRemainingSchedule;
    }

    const modifiedInterest = modifiedSchedule.reduce(
      (sum, row) => sum + row.interestComponent,
      0,
    );
    const newTenure = currentMonth + modifiedSchedule.length;
    const monthsSaved = tenureMonths - newTenure;
    const interestSaved = originalRemainingInterest - modifiedInterest;

    let recommendation = '';
    if (whatIf.type === WhatIfType.EXTRA_MONTHLY) {
      const yearsFloat = monthsSaved / 12;
      const years = Math.floor(yearsFloat);
      const months = Math.round((yearsFloat - years) * 12);
      const savedLakhs = (interestSaved / 100000).toFixed(2);
      
      if (years > 0 && months > 0) {
        recommendation = `Adding ₹${whatIf.amount?.toLocaleString('en-IN')} extra per month will save you ${years} years ${months} months and ₹${savedLakhs} lakhs in interest`;
      } else if (years > 0) {
        recommendation = `Adding ₹${whatIf.amount?.toLocaleString('en-IN')} extra per month will save you ${years} years and ₹${savedLakhs} lakhs in interest`;
      } else {
        recommendation = `Adding ₹${whatIf.amount?.toLocaleString('en-IN')} extra per month will save you ${monthsSaved} months and ₹${savedLakhs} lakhs in interest`;
      }
    } else if (whatIf.type === WhatIfType.LUMPSUM) {
      const savedLakhs = (interestSaved / 100000).toFixed(2);
      recommendation = `A lumpsum of ₹${whatIf.amount?.toLocaleString('en-IN')} will save you ${monthsSaved} months and ₹${savedLakhs} lakhs in interest`;
    } else if (whatIf.type === WhatIfType.RATE_CHANGE) {
      if (interestSaved > 0) {
        recommendation = `Rate change to ${whatIf.newRate}% will save you ₹${(interestSaved / 100000).toFixed(2)} lakhs in interest`;
      } else {
        recommendation = `Rate change to ${whatIf.newRate}% will cost you an additional ₹${(Math.abs(interestSaved) / 100000).toFixed(2)} lakhs in interest`;
      }
    }

    return {
      impact: {
        monthsSaved,
        interestSaved,
        newTenure,
        newEMI,
      },
      recommendation,
    };
  }
}
