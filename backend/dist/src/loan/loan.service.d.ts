import { CalculateLoanDto } from './dto/calculate-loan.dto';
import { CalculateWithPrepaymentsDto } from './dto/calculate-with-prepayments.dto';
import { WhatIfDto } from './dto/what-if.dto';
import { AmortizationRow, CalculateLoanResponse, CalculateWithPrepaymentsResponse, WhatIfResponse } from './interfaces/calculation-result.interface';
export declare class LoanService {
    calculateEMI(principal: number, annualInterestRate: number, tenureMonths: number): number;
    private formatMonthYear;
    private formatDate;
    generateAmortizationSchedule(principal: number, annualInterestRate: number, tenureMonths: number, startDate?: string): AmortizationRow[];
    private findBreakevenMonth;
    calculateLoan(dto: CalculateLoanDto): CalculateLoanResponse;
    calculateWithPrepayments(dto: CalculateWithPrepaymentsDto): CalculateWithPrepaymentsResponse;
    private applyPrepayments;
    calculateWhatIf(dto: WhatIfDto): WhatIfResponse;
}
