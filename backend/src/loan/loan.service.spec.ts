import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { PrepaymentType, ImpactStrategy } from './interfaces/calculation-result.interface';
import { WhatIfType } from './dto/what-if.dto';

describe('LoanService', () => {
  let service: LoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanService],
    }).compile();

    service = module.get<LoanService>(LoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateEMI', () => {
    it('should calculate EMI correctly for standard loan (₹50L, 8.5%, 20yr)', () => {
      const emi = service.calculateEMI(5000000, 8.5, 240);
      expect(emi).toBe(43391);
    });

    it('should handle zero interest rate', () => {
      const emi = service.calculateEMI(1000000, 0, 120);
      expect(emi).toBe(8333);
    });

    it('should calculate EMI for short tenure', () => {
      const emi = service.calculateEMI(500000, 9, 12);
      expect(emi).toBe(43726);
    });

    it('should calculate EMI for high interest rate', () => {
      const emi = service.calculateEMI(1000000, 15, 120);
      expect(emi).toBe(16133);
    });
  });

  describe('generateAmortizationSchedule', () => {
    it('should generate correct number of months for tenure', () => {
      const schedule = service.generateAmortizationSchedule(5000000, 8.5, 240, '2024-01-01');
      expect(schedule.length).toBe(240);
    });

    it('should have closing balance of 0 in last month', () => {
      const schedule = service.generateAmortizationSchedule(5000000, 8.5, 240, '2024-01-01');
      const lastMonth = schedule[schedule.length - 1];
      expect(lastMonth.closingBalance).toBe(0);
    });

    it('should have correct first month values', () => {
      const schedule = service.generateAmortizationSchedule(5000000, 8.5, 240, '2024-01-01');
      const firstMonth = schedule[0];
      
      expect(firstMonth.monthNumber).toBe(1);
      expect(firstMonth.openingBalance).toBe(5000000);
      expect(firstMonth.interestComponent).toBe(35417);
      expect(firstMonth.principalComponent).toBe(7974);
      expect(firstMonth.monthYear).toBe('Jan 2024');
    });

    it('should have cumulative values summing correctly', () => {
      const schedule = service.generateAmortizationSchedule(5000000, 8.5, 240, '2024-01-01');
      const lastMonth = schedule[schedule.length - 1];
      
      const totalInterest = schedule.reduce((sum, row) => sum + row.interestComponent, 0);
      const totalPrincipal = schedule.reduce((sum, row) => sum + row.principalComponent, 0);
      
      expect(Math.abs(lastMonth.cumulativeInterest - totalInterest)).toBeLessThanOrEqual(10);
      expect(totalPrincipal).toBeGreaterThanOrEqual(4999990);
      expect(totalPrincipal).toBeLessThanOrEqual(5000010);
    });

    it('should identify breakeven month correctly', () => {
      const schedule = service.generateAmortizationSchedule(5000000, 8.5, 240, '2024-01-01');
      const breakevenRows = schedule.filter(row => row.isBreakeven);
      
      expect(breakevenRows.length).toBeGreaterThan(0);
      const firstBreakeven = breakevenRows[0];
      expect(firstBreakeven.principalComponent).toBeGreaterThan(firstBreakeven.interestComponent);
    });
  });

  describe('calculateLoan', () => {
    it('should return complete loan calculation response', () => {
      const result = service.calculateLoan({
        principal: 5000000,
        annualInterestRate: 8.5,
        tenureMonths: 240,
        startDate: '2024-01-01',
      });

      expect(result.loanParameters.principal).toBe(5000000);
      expect(result.calculation.emi).toBe(43391);
      expect(result.calculation.totalInterest).toBeGreaterThan(5000000);
      expect(result.calculation.totalAmount).toBeGreaterThan(10000000);
      expect(result.amortizationSchedule.length).toBe(240);
    });

    it('should use current date if startDate not provided', () => {
      const result = service.calculateLoan({
        principal: 1000000,
        annualInterestRate: 8,
        tenureMonths: 60,
      });

      expect(result.loanParameters.startDate).toBeDefined();
      expect(result.amortizationSchedule.length).toBe(60);
    });
  });

  describe('calculateWithPrepayments', () => {
    it('should reduce tenure with periodic extra payments', () => {
      const result = service.calculateWithPrepayments({
        loanParameters: {
          principal: 5000000,
          annualInterestRate: 8.5,
          tenureMonths: 240,
          startDate: '2024-01-01',
        },
        prepayments: [
          {
            type: PrepaymentType.PERIODIC_EXTRA,
            startMonth: 1,
            endMonth: 60,
            extraAmountPerMonth: 10000,
            impactStrategy: ImpactStrategy.REDUCE_TENURE,
          },
        ],
      });

      expect(result.original.tenure).toBe(240);
      expect(result.modified.tenure).toBeLessThan(240);
      expect(result.comparison.tenureReduced).toBeGreaterThan(0);
      expect(result.comparison.interestSaved).toBeGreaterThan(0);
    });

    it('should handle lumpsum payment', () => {
      const result = service.calculateWithPrepayments({
        loanParameters: {
          principal: 5000000,
          annualInterestRate: 8.5,
          tenureMonths: 240,
          startDate: '2024-01-01',
        },
        prepayments: [
          {
            type: PrepaymentType.LUMPSUM,
            paymentMonth: 12,
            lumpsumAmount: 500000,
            impactStrategy: ImpactStrategy.REDUCE_TENURE,
          },
        ],
      });

      expect(result.modified.tenure).toBeLessThan(240);
      expect(result.comparison.totalExtraPaid).toBe(500000);
    });

    it('should calculate ROI correctly', () => {
      const result = service.calculateWithPrepayments({
        loanParameters: {
          principal: 5000000,
          annualInterestRate: 8.5,
          tenureMonths: 240,
          startDate: '2024-01-01',
        },
        prepayments: [
          {
            type: PrepaymentType.PERIODIC_EXTRA,
            startMonth: 1,
            endMonth: 60,
            extraAmountPerMonth: 10000,
            impactStrategy: ImpactStrategy.REDUCE_TENURE,
          },
        ],
      });

      const expectedROI = (result.comparison.interestSaved / result.comparison.totalExtraPaid) * 100;
      expect(result.comparison.roi).toBeCloseTo(expectedROI, 1);
    });

    it('should handle multiple prepayments', () => {
      const result = service.calculateWithPrepayments({
        loanParameters: {
          principal: 5000000,
          annualInterestRate: 8.5,
          tenureMonths: 240,
          startDate: '2024-01-01',
        },
        prepayments: [
          {
            type: PrepaymentType.PERIODIC_EXTRA,
            startMonth: 1,
            endMonth: 60,
            extraAmountPerMonth: 10000,
            impactStrategy: ImpactStrategy.REDUCE_TENURE,
          },
          {
            type: PrepaymentType.LUMPSUM,
            paymentMonth: 36,
            lumpsumAmount: 200000,
            impactStrategy: ImpactStrategy.REDUCE_TENURE,
          },
        ],
      });

      expect(result.prepaymentSummary.length).toBe(2);
      expect(result.comparison.totalExtraPaid).toBe(600000 + 200000);
    });
  });

  describe('calculateWhatIf', () => {
    it('should calculate impact of extra monthly payment', () => {
      const result = service.calculateWhatIf({
        currentScenario: {
          principal: 5000000,
          annualInterestRate: 8.5,
          tenureMonths: 240,
          currentMonth: 12,
          outstandingBalance: 4892126,
        },
        whatIf: {
          type: WhatIfType.EXTRA_MONTHLY,
          amount: 5000,
          fromMonth: 13,
          toMonth: 240,
        },
      });

      expect(result.impact.monthsSaved).toBeGreaterThan(0);
      expect(result.impact.interestSaved).toBeGreaterThan(0);
      expect(result.recommendation).toContain('5,000');
    });

    it('should calculate impact of lumpsum payment', () => {
      const result = service.calculateWhatIf({
        currentScenario: {
          principal: 5000000,
          annualInterestRate: 8.5,
          tenureMonths: 240,
          currentMonth: 12,
          outstandingBalance: 4892126,
        },
        whatIf: {
          type: WhatIfType.LUMPSUM,
          amount: 500000,
          lumpsumMonth: 1,
        },
      });

      expect(result.impact.monthsSaved).toBeGreaterThan(0);
      expect(result.impact.interestSaved).toBeGreaterThan(0);
    });

    it('should calculate impact of rate change', () => {
      const result = service.calculateWhatIf({
        currentScenario: {
          principal: 5000000,
          annualInterestRate: 8.5,
          tenureMonths: 240,
          currentMonth: 12,
          outstandingBalance: 4892126,
        },
        whatIf: {
          type: WhatIfType.RATE_CHANGE,
          newRate: 7.5,
        },
      });

      expect(result.impact.interestSaved).toBeGreaterThan(0);
      expect(result.impact.newEMI).toBeLessThan(43391);
    });
  });
});
