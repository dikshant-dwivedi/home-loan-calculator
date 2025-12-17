export declare enum WhatIfType {
    EXTRA_MONTHLY = "extra_monthly",
    LUMPSUM = "lumpsum",
    RATE_CHANGE = "rate_change"
}
export declare class CurrentScenarioDto {
    principal: number;
    annualInterestRate: number;
    tenureMonths: number;
    currentMonth: number;
    outstandingBalance: number;
}
export declare class WhatIfScenarioDto {
    type: WhatIfType;
    amount?: number;
    fromMonth?: number;
    toMonth?: number;
    newRate?: number;
    lumpsumMonth?: number;
}
export declare class WhatIfDto {
    currentScenario: CurrentScenarioDto;
    whatIf: WhatIfScenarioDto;
}
