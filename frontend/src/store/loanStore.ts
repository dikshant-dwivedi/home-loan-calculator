import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoanParameters, AmortizationRow, PrepaymentAction } from '@/types';

interface LoanState {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  startDate: Date | null;
  emi: number | null;
  amortizationSchedule: AmortizationRow[];
  prepayments: PrepaymentAction[];
  selectedMonths: number[];
  comparisonMode: boolean;
  setLoanParameters: (params: Partial<LoanParameters>) => void;
  addPrepayment: (prepayment: PrepaymentAction) => void;
  removePrepayment: (id: string) => void;
  toggleMonth: (month: number) => void;
  clearSelection: () => void;
  reset: () => void;
}

export const useLoanStore = create<LoanState>()(
  persist(
    (set) => ({
      principal: 0,
      annualInterestRate: 0,
      tenureMonths: 0,
      startDate: null,
      emi: null,
      amortizationSchedule: [],
      prepayments: [],
      selectedMonths: [],
      comparisonMode: false,
      setLoanParameters: (params) => set((state) => ({ ...state, ...params })),
      addPrepayment: (prepayment) =>
        set((state) => ({
          prepayments: [...state.prepayments, prepayment],
        })),
      removePrepayment: (id) =>
        set((state) => ({
          prepayments: state.prepayments.filter((p) => p.id !== id),
        })),
      toggleMonth: (month) =>
        set((state) => ({
          selectedMonths: state.selectedMonths.includes(month)
            ? state.selectedMonths.filter((m) => m !== month)
            : [...state.selectedMonths, month],
        })),
      clearSelection: () => set({ selectedMonths: [] }),
      reset: () =>
        set({
          principal: 0,
          annualInterestRate: 0,
          tenureMonths: 0,
          startDate: null,
          emi: null,
          amortizationSchedule: [],
          prepayments: [],
          selectedMonths: [],
        }),
    }),
    {
      name: 'loan-calculator-storage',
    }
  )
);
