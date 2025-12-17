import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Max,
  ValidateNested,
  ValidateIf,
} from 'class-validator';

export enum WhatIfType {
  EXTRA_MONTHLY = 'extra_monthly',
  LUMPSUM = 'lumpsum',
  RATE_CHANGE = 'rate_change',
}

export class CurrentScenarioDto {
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

  @IsNumber()
  @Min(1, { message: 'Current month must be at least 1' })
  currentMonth: number;

  @IsNumber()
  @Min(0, { message: 'Outstanding balance cannot be negative' })
  outstandingBalance: number;
}

export class WhatIfScenarioDto {
  @IsEnum(WhatIfType, {
    message: 'Type must be one of: extra_monthly, lumpsum, rate_change',
  })
  type: WhatIfType;

  @ValidateIf((o) => o.type === WhatIfType.EXTRA_MONTHLY || o.type === WhatIfType.LUMPSUM)
  @IsNumber()
  @Min(1, { message: 'Amount must be at least ₹1' })
  amount?: number;

  @ValidateIf((o) => o.type === WhatIfType.EXTRA_MONTHLY)
  @IsNumber()
  @Min(1, { message: 'From month must be at least 1' })
  fromMonth?: number;

  @ValidateIf((o) => o.type === WhatIfType.EXTRA_MONTHLY)
  @IsNumber()
  @Min(1, { message: 'To month must be at least 1' })
  toMonth?: number;

  @ValidateIf((o) => o.type === WhatIfType.RATE_CHANGE)
  @IsNumber()
  @Min(0.01, { message: 'New rate must be at least 0.01%' })
  @Max(30, { message: 'New rate cannot exceed 30%' })
  newRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  lumpsumMonth?: number;
}

export class WhatIfDto {
  @ValidateNested()
  @Type(() => CurrentScenarioDto)
  currentScenario: CurrentScenarioDto;

  @ValidateNested()
  @Type(() => WhatIfScenarioDto)
  whatIf: WhatIfScenarioDto;
}
