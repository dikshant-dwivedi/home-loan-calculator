import { LoanService } from './loan.service';
import { CalculateLoanDto } from './dto/calculate-loan.dto';
import { CalculateWithPrepaymentsDto } from './dto/calculate-with-prepayments.dto';
import { WhatIfDto } from './dto/what-if.dto';
import type { ApiResponse, CalculateLoanResponse, CalculateWithPrepaymentsResponse, WhatIfResponse } from './interfaces/calculation-result.interface';
export declare class LoanController {
    private readonly loanService;
    constructor(loanService: LoanService);
    calculateLoan(dto: CalculateLoanDto): ApiResponse<CalculateLoanResponse>;
    calculateWithPrepayments(dto: CalculateWithPrepaymentsDto): ApiResponse<CalculateWithPrepaymentsResponse>;
    calculateWhatIf(dto: WhatIfDto): ApiResponse<WhatIfResponse>;
}
