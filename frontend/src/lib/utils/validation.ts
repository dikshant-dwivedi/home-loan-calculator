import { z } from 'zod';

export const loanParametersSchema = z.object({
  principal: z
    .number()
    .min(100000, 'Principal must be at least ₹1,00,000')
    .max(100000000, 'Principal cannot exceed ₹10,00,00,000'),
  annualInterestRate: z
    .number()
    .min(0.01, 'Interest rate must be at least 0.01%')
    .max(30, 'Interest rate cannot exceed 30%'),
  tenureMonths: z
    .number()
    .int('Tenure must be a whole number')
    .min(6, 'Tenure must be at least 6 months')
    .max(480, 'Tenure cannot exceed 480 months (40 years)'),
  startDate: z.date().optional(),
});

export type LoanParametersFormData = z.infer<typeof loanParametersSchema>;
