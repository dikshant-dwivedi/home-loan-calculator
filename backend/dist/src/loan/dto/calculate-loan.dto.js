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
exports.CalculateLoanDto = void 0;
const class_validator_1 = require("class-validator");
class CalculateLoanDto {
    principal;
    annualInterestRate;
    tenureMonths;
    startDate;
}
exports.CalculateLoanDto = CalculateLoanDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100000, { message: 'Principal must be at least ₹1,00,000' }),
    (0, class_validator_1.Max)(100000000, { message: 'Principal cannot exceed ₹10,00,00,000' }),
    __metadata("design:type", Number)
], CalculateLoanDto.prototype, "principal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Interest rate must be at least 0.01%' }),
    (0, class_validator_1.Max)(30, { message: 'Interest rate cannot exceed 30%' }),
    __metadata("design:type", Number)
], CalculateLoanDto.prototype, "annualInterestRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(6, { message: 'Tenure must be at least 6 months' }),
    (0, class_validator_1.Max)(480, { message: 'Tenure cannot exceed 480 months (40 years)' }),
    __metadata("design:type", Number)
], CalculateLoanDto.prototype, "tenureMonths", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Start date must be a valid ISO 8601 date' }),
    __metadata("design:type", String)
], CalculateLoanDto.prototype, "startDate", void 0);
//# sourceMappingURL=calculate-loan.dto.js.map