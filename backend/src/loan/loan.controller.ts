import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoanService } from './loan.service';
import { CalculateLoanDto } from './dto/calculate-loan.dto';
import { CalculateWithPrepaymentsDto } from './dto/calculate-with-prepayments.dto';
import { WhatIfDto } from './dto/what-if.dto';
import type {
  ApiResponse,
  CalculateLoanResponse,
  CalculateWithPrepaymentsResponse,
  WhatIfResponse,
} from './interfaces/calculation-result.interface';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  calculateLoan(
    @Body() dto: CalculateLoanDto,
  ): ApiResponse<CalculateLoanResponse> {
    const data = this.loanService.calculateLoan(dto);
    return {
      success: true,
      data,
      message: 'EMI calculated successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('calculate-with-prepayments')
  @HttpCode(HttpStatus.OK)
  calculateWithPrepayments(
    @Body() dto: CalculateWithPrepaymentsDto,
  ): ApiResponse<CalculateWithPrepaymentsResponse> {
    const data = this.loanService.calculateWithPrepayments(dto);
    return {
      success: true,
      data,
      message: 'Loan calculated with prepayments successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('what-if')
  @HttpCode(HttpStatus.OK)
  calculateWhatIf(@Body() dto: WhatIfDto): ApiResponse<WhatIfResponse> {
    const data = this.loanService.calculateWhatIf(dto);
    return {
      success: true,
      data,
      message: 'What-if scenario calculated successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
