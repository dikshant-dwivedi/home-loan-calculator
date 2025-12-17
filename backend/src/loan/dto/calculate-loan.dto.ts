import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class CalculateLoanDto {
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
