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
exports.WhatIfDto = exports.WhatIfScenarioDto = exports.CurrentScenarioDto = exports.WhatIfType = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var WhatIfType;
(function (WhatIfType) {
    WhatIfType["EXTRA_MONTHLY"] = "extra_monthly";
    WhatIfType["LUMPSUM"] = "lumpsum";
    WhatIfType["RATE_CHANGE"] = "rate_change";
})(WhatIfType || (exports.WhatIfType = WhatIfType = {}));
class CurrentScenarioDto {
    principal;
    annualInterestRate;
    tenureMonths;
    currentMonth;
    outstandingBalance;
}
exports.CurrentScenarioDto = CurrentScenarioDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100000, { message: 'Principal must be at least ₹1,00,000' }),
    (0, class_validator_1.Max)(100000000, { message: 'Principal cannot exceed ₹10,00,00,000' }),
    __metadata("design:type", Number)
], CurrentScenarioDto.prototype, "principal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Interest rate must be at least 0.01%' }),
    (0, class_validator_1.Max)(30, { message: 'Interest rate cannot exceed 30%' }),
    __metadata("design:type", Number)
], CurrentScenarioDto.prototype, "annualInterestRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(6, { message: 'Tenure must be at least 6 months' }),
    (0, class_validator_1.Max)(480, { message: 'Tenure cannot exceed 480 months (40 years)' }),
    __metadata("design:type", Number)
], CurrentScenarioDto.prototype, "tenureMonths", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Current month must be at least 1' }),
    __metadata("design:type", Number)
], CurrentScenarioDto.prototype, "currentMonth", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'Outstanding balance cannot be negative' }),
    __metadata("design:type", Number)
], CurrentScenarioDto.prototype, "outstandingBalance", void 0);
class WhatIfScenarioDto {
    type;
    amount;
    fromMonth;
    toMonth;
    newRate;
    lumpsumMonth;
}
exports.WhatIfScenarioDto = WhatIfScenarioDto;
__decorate([
    (0, class_validator_1.IsEnum)(WhatIfType, {
        message: 'Type must be one of: extra_monthly, lumpsum, rate_change',
    }),
    __metadata("design:type", String)
], WhatIfScenarioDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === WhatIfType.EXTRA_MONTHLY || o.type === WhatIfType.LUMPSUM),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Amount must be at least ₹1' }),
    __metadata("design:type", Number)
], WhatIfScenarioDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === WhatIfType.EXTRA_MONTHLY),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'From month must be at least 1' }),
    __metadata("design:type", Number)
], WhatIfScenarioDto.prototype, "fromMonth", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === WhatIfType.EXTRA_MONTHLY),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'To month must be at least 1' }),
    __metadata("design:type", Number)
], WhatIfScenarioDto.prototype, "toMonth", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.type === WhatIfType.RATE_CHANGE),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'New rate must be at least 0.01%' }),
    (0, class_validator_1.Max)(30, { message: 'New rate cannot exceed 30%' }),
    __metadata("design:type", Number)
], WhatIfScenarioDto.prototype, "newRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], WhatIfScenarioDto.prototype, "lumpsumMonth", void 0);
class WhatIfDto {
    currentScenario;
    whatIf;
}
exports.WhatIfDto = WhatIfDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CurrentScenarioDto),
    __metadata("design:type", CurrentScenarioDto)
], WhatIfDto.prototype, "currentScenario", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => WhatIfScenarioDto),
    __metadata("design:type", WhatIfScenarioDto)
], WhatIfDto.prototype, "whatIf", void 0);
//# sourceMappingURL=what-if.dto.js.map