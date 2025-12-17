import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
  ValidateNested,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { ImpactStrategy, PrepaymentType } from '../interfaces/calculation-result.interface';

export class LoanParametersDto {
  @IsNumber()
  @Min(100000, { message: 'Principal must be at least ₹1,00,000' })
  @Max(100000000, { message: 'Principal cannot exceed ₹10,00,00,000' })
  principal: number;

  @IsNumber()
  @Min(0.01, { message: 'Interest rate must be at least 0.01%' })
  @Max(30, { message: 'Interest rate cannot exceed 30%' })
  annualInterestRate: number;

  @IsNumber()
  @Min(6, { message: 'Tenure must be at least 6 months' })
  @Max(480, { message: 'Tenure cannot exceed 480 months (40 years)' })
  tenureMonths: number;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO 8601 date' })
  startDate?: string;
}

export class PrepaymentDto {
  @IsEnum(PrepaymentType, {
    message: 'Type must be one of: periodic_extra, lumpsum, missed_payment',
  })
  type: PrepaymentType;

  @ValidateIf((o) => o.type === PrepaymentType.PERIODIC_EXTRA)
  @IsNumber()
  @Min(1, { message: 'Start month must be at least 1' })
  startMonth?: number;

  @ValidateIf((o) => o.type === PrepaymentType.PERIODIC_EXTRA)
  @IsNumber()
  @Min(1, { message: 'End month must be at least 1' })
  endMonth?: number;

  @ValidateIf((o) => o.type === PrepaymentType.PERIODIC_EXTRA)
  @IsNumber()
  @Min(1, { message: 'Extra amount per month must be at least ₹1' })
  extraAmountPerMonth?: number;

  @ValidateIf((o) => o.type === PrepaymentType.LUMPSUM)
  @IsNumber()
  @Min(1, { message: 'Payment month must be at least 1' })
  paymentMonth?: number;

  @ValidateIf((o) => o.type === PrepaymentType.LUMPSUM)
  @IsNumber()
  @Min(1, { message: 'Lumpsum amount must be at least ₹1' })
  lumpsumAmount?: number;

  @ValidateIf((o) => o.type === PrepaymentType.MISSED_PAYMENT)
  @IsNumber()
  @Min(1, { message: 'Missed month must be at least 1' })
  missedMonth?: number;

  @ValidateIf((o) => o.type === PrepaymentType.MISSED_PAYMENT)
  @IsNumber()
  @Min(0, { message: 'Penalty amount cannot be negative' })
  penaltyAmount?: number;

  @ValidateIf((o) => o.type !== PrepaymentType.MISSED_PAYMENT)
  @IsEnum(ImpactStrategy, {
    message: 'Impact strategy must be one of: reduce_tenure, reduce_emi',
  })
  impactStrategy?: ImpactStrategy;
}

export class CalculateWithPrepaymentsDto {
  @ValidateNested()
  @Type(() => LoanParametersDto)
  loanParameters: LoanParametersDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrepaymentDto)
  prepayments: PrepaymentDto[];
}
