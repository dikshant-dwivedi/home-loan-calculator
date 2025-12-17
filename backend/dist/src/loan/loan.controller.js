"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanController = void 0;
const common_1 = require("@nestjs/common");
const loan_service_1 = require("./loan.service");
const calculate_loan_dto_1 = require("./dto/calculate-loan.dto");
const calculate_with_prepayments_dto_1 = require("./dto/calculate-with-prepayments.dto");
const what_if_dto_1 = require("./dto/what-if.dto");
let LoanController = class LoanController {
    loanService;
    constructor(loanService) {
        this.loanService = loanService;
    }
    calculateLoan(dto) {
        const data = this.loanService.calculateLoan(dto);
        return {
            success: true,
            data,
            message: 'EMI calculated successfully',
            timestamp: new Date().toISOString(),
        };
    }
    calculateWithPrepayments(dto) {
        const data = this.loanService.calculateWithPrepayments(dto);
        return {
            success: true,
            data,
            message: 'Loan calculated with prepayments successfully',
            timestamp: new Date().toISOString(),
        };
    }
    calculateWhatIf(dto) {
        const data = this.loanService.calculateWhatIf(dto);
        return {
            success: true,
            data,
            message: 'What-if scenario calculated successfully',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.LoanController = LoanController;
__decorate([
    (0, common_1.Post)('calculate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_loan_dto_1.CalculateLoanDto]),
    __metadata("design:returntype", Object)
], LoanController.prototype, "calculateLoan", null);
__decorate([
    (0, common_1.Post)('calculate-with-prepayments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [calculate_with_prepayments_dto_1.CalculateWithPrepaymentsDto]),
    __metadata("design:returntype", Object)
], LoanController.prototype, "calculateWithPrepayments", null);
__decorate([
    (0, common_1.Post)('what-if'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [what_if_dto_1.WhatIfDto]),
    __metadata("design:returntype", Object)
], LoanController.prototype, "calculateWhatIf", null);
exports.LoanController = LoanController = __decorate([
    (0, common_1.Controller)('loan'),
    __metadata("design:paramtypes", [loan_service_1.LoanService])
], LoanController);
//# sourceMappingURL=loan.controller.js.map