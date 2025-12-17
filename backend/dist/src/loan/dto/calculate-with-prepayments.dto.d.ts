import { ImpactStrategy, PrepaymentType } from '../interfaces/calculation-result.interface';
export declare class LoanParametersDto {
    principal: number;
    annualInterestRate: number;
    tenureMonths: number;
    startDate?: string;
}
export declare class PrepaymentDto {
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
export declare class CalculateWithPrepaymentsDto {
    loanParameters: LoanParametersDto;
    prepayments: PrepaymentDto[];
}
