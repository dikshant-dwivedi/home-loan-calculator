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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateWithPrepaymentsDto = exports.PrepaymentDto = exports.LoanParametersDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const calculation_result_interface_1 = require("../interfaces/calculation-result.interface");
class LoanParametersDto {
    principal;
    annualInterestRate;
    tenureMonths;
    startDate;
}
exports.LoanParametersDto = LoanParametersDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100000, { message: 'Principal must be at least ₹1,00,000' }),
    (0, class_validator_1.Max)(100000000, { message: 'Principal cannot exceed ₹10,00,00,000' }),
    __metadata("design:type", Number)
], LoanParametersDto.prototype, "principal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Interest rate must be at least 0.01%' }),
    (0, class_validator_1.Max)(30, { message: 'Interest rate cannot exceed 30%' }),
    __metadata("design:type", Number)
], LoanParametersDto.prototype, "annualInterestRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(6, { message: 'Tenure must be at least 6 months' }),
    (0, class_validator_1.Max)(480, { message: 'Tenure cannot exceed 480 months (40 years)' }),
    __metadata("design:type", Number)
], LoanParametersDto.prototype, "tenureMonths", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Start date must be a valid ISO 8601 date' }),
    __metadata("design:type", String)
], LoanParametersDto.prototype, "startDate", void 0);
class PrepaymentDto {
    type;
    startMonth;
    endMonth;
    extraAmountPerMonth;
    paymentMonth;
    lumpsumAmount;
    missedMonth;
    penaltyAmount;
    impactStrategy;
}
exports.PrepaymentDto = PrepaymentDto;
__decorate([
    (0, class_validator_1.IsEnum)(calculation_result_interface_1.PrepaymentType, {
        message: 'Type must be one of: periodic_extra, lumpsum, missed_payment',
    }),
    __metadata("design:type", String)
], PrepaymentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === calculation_result_interface_1.PrepaymentType.PERIODIC_EXTRA),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Start month must be at least 1' }),
    __metadata("design:type", Number)
], PrepaymentDto.prototype, "startMonth", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === calculation_result_interface_1.PrepaymentType.PERIODIC_EXTRA),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'End month must be at least 1' }),
    __metadata("design:type", Number)
], PrepaymentDto.prototype, "endMonth", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === calculation_result_interface_1.PrepaymentType.PERIODIC_EXTRA),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Extra amount per month must be at least ₹1' }),
    __metadata("design:type", Number)
], PrepaymentDto.prototype, "extraAmountPerMonth", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === calculation_result_interface_1.PrepaymentType.LUMPSUM),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Payment month must be at least 1' }),
    __metadata("design:type", Number)
], PrepaymentDto.prototype, "paymentMonth", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === calculation_result_interface_1.PrepaymentType.LUMPSUM),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Lumpsum amount must be at least ₹1' }),
    __metadata("design:type", Number)
], PrepaymentDto.prototype, "lumpsumAmount", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === calculation_result_interface_1.PrepaymentType.MISSED_PAYMENT),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Missed month must be at least 1' }),
    __metadata("design:type", Number)
], PrepaymentDto.prototype, "missedMonth", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === calculation_result_interface_1.PrepaymentType.MISSED_PAYMENT),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Penalty amount cannot be negative' }),
    __metadata("design:type", Number)
], PrepaymentDto.prototype, "penaltyAmount", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type !== calculation_result_interface_1.PrepaymentType.MISSED_PAYMENT),
    (0, class_validator_1.IsEnum)(calculation_result_interface_1.ImpactStrategy, {
        message: 'Impact strategy must be one of: reduce_tenure, reduce_emi',
    }),
    __metadata("design:type", String)
], PrepaymentDto.prototype, "impactStrategy", void 0);
class CalculateWithPrepaymentsDto {
    loanParameters;
    prepayments;
}
exports.CalculateWithPrepaymentsDto = CalculateWithPrepaymentsDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LoanParametersDto),
    __metadata("design:type", LoanParametersDto)
], CalculateWithPrepaymentsDto.prototype, "loanParameters", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PrepaymentDto),
    __metadata("design:type", Array)
], CalculateWithPrepaymentsDto.prototype, "prepayments", void 0);
//# sourceMappingURL=calculate-with-prepayments.dto.js.map