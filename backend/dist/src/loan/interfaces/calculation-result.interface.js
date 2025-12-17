"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactStrategy = exports.PrepaymentType = void 0;
var PrepaymentType;
(function (PrepaymentType) {
    PrepaymentType["PERIODIC_EXTRA"] = "periodic_extra";
    PrepaymentType["LUMPSUM"] = "lumpsum";
    PrepaymentType["MISSED_PAYMENT"] = "missed_payment";
})(PrepaymentType || (exports.PrepaymentType = PrepaymentType = {}));
var ImpactStrategy;
(function (ImpactStrategy) {
    ImpactStrategy["REDUCE_TENURE"] = "reduce_tenure";
    ImpactStrategy["REDUCE_EMI"] = "reduce_emi";
})(ImpactStrategy || (exports.ImpactStrategy = ImpactStrategy = {}));
//# sourceMappingURL=calculation-result.interface.js.map