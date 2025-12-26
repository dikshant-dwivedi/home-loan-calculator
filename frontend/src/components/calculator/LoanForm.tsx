'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { loanParametersSchema, type LoanParametersFormData } from '@/lib/utils/validation';

interface LoanFormProps {
  onSubmit: (data: LoanParametersFormData) => void;
  isLoading?: boolean;
}

export function LoanForm({ onSubmit, isLoading = false }: LoanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoanParametersFormData>({
    resolver: zodResolver(loanParametersSchema),
    defaultValues: {
      principal: 5000000,
      annualInterestRate: 8.5,
      tenureMonths: 240,
    },
  });

  const tenureMonths = watch('tenureMonths');
  const tenureYears = tenureMonths ? Math.floor(tenureMonths / 12) : 0;
  const remainingMonths = tenureMonths ? tenureMonths % 12 : 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Loan Details</h2>

        <div className="space-y-2">
          <label htmlFor="principal" className="block text-sm font-medium">
            Principal Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              id="principal"
              type="number"
              {...register('principal', { valueAsNumber: true })}
              className="w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="50,00,000"
              disabled={isLoading}
            />
          </div>
          {errors.principal && (
            <p className="text-sm text-red-600">{errors.principal.message}</p>
          )}
          <p className="text-xs text-gray-500">Min: ₹1L | Max: ₹10Cr</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="annualInterestRate" className="block text-sm font-medium">
            Annual Interest Rate (%) *
          </label>
          <div className="relative">
            <input
              id="annualInterestRate"
              type="number"
              step="0.01"
              {...register('annualInterestRate', { valueAsNumber: true })}
              className="w-full pr-8 pl-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="8.5"
              disabled={isLoading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
          {errors.annualInterestRate && (
            <p className="text-sm text-red-600">{errors.annualInterestRate.message}</p>
          )}
          <p className="text-xs text-gray-500">Range: 0.01% - 30%</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="tenureMonths" className="block text-sm font-medium">
            Loan Tenure *
          </label>
          <input
            id="tenureMonths"
            type="number"
            {...register('tenureMonths', { valueAsNumber: true })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="240"
            disabled={isLoading}
          />
          {errors.tenureMonths && (
            <p className="text-sm text-red-600">{errors.tenureMonths.message}</p>
          )}
          {tenureMonths > 0 && (
            <p className="text-xs text-gray-500">
              = {tenureYears} years{remainingMonths > 0 && ` ${remainingMonths} months`}
            </p>
          )}
          <p className="text-xs text-gray-500">Min: 6 months | Max: 40 years</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium">
            Start Date (Optional)
          </label>
          <input
            id="startDate"
            type="date"
            {...register('startDate', {
              setValueAs: (v) => (v ? new Date(v) : undefined),
            })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          {errors.startDate && (
            <p className="text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Calculating...' : 'Calculate EMI'}
      </Button>
    </form>
  );
}
