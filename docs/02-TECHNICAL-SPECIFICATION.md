# Technical Specification Document
# Home Loan Prepayment Calculator

**Version:** 1.0  
**Last Updated:** December 2024  
**Tech Stack:** Next.js (Frontend) + NestJS (Backend)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│                    (Next.js 14+ App Router)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  UI Components (React + TypeScript + Tailwind CSS)   │  │
│  │  - Loan Calculator Forms                             │  │
│  │  - Interactive Amortization Table                     │  │
│  │  - Charts & Visualizations (Recharts)               │  │
│  │  - Prepayment Configuration UI                       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State Management (Zustand / React Context)          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services Layer                                       │  │
│  │  - Calculation Engine (Client-side)                  │  │
│  │  - API Client (Axios/Fetch)                          │  │
│  │  - Local Storage Manager                             │  │
│  │  - Export Services (PDF, CSV, Excel)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API / GraphQL
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend Layer                        │
│                         (NestJS)                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers (REST Endpoints)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services                                             │  │
│  │  - Loan Calculation Service                          │  │
│  │  - Scenario Management Service                       │  │
│  │  - Export Service                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Data Layer                                           │  │
│  │  - TypeORM / Prisma                                   │  │
│  │  - PostgreSQL (future: user data, saved scenarios)   │  │
│  │  - Redis (caching - optional)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Design Decisions

#### Frontend-Heavy Architecture
- **Rationale:** Loan calculations are computationally light and can be performed client-side
- **Benefits:**
  - Instant calculations without network latency
  - Works offline (PWA)
  - Reduced server load
  - Better privacy (no loan data sent to server)
- **Trade-off:** Backend primarily for data persistence and future features

#### State Management Choice
- **Zustand** (Recommended) or **React Context + useReducer**
- **Rationale:**
  - Simpler than Redux for this use case
  - Good TypeScript support
  - Minimal boilerplate
  - Easy to persist state to localStorage

---

## 2. Technology Stack

### 2.1 Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x | React framework with App Router |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.x | Styling |
| **shadcn/ui** | Latest | UI component library |
| **Recharts** | 2.x | Charts and visualizations |
| **Zustand** | 4.x | State management |
| **React Hook Form** | 7.x | Form handling |
| **Zod** | 3.x | Schema validation |
| **date-fns** | 3.x | Date manipulation |
| **jsPDF** | 2.x | PDF generation |
| **xlsx** | 0.18.x | Excel export |
| **decimal.js** | 10.x | Precise financial calculations |

### 2.2 Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | 10.x | Backend framework |
| **TypeScript** | 5.x | Type safety |
| **Prisma** | 7.x | ORM |
| **PostgreSQL** | 15.x | Database |
| **class-validator** | 0.14.x | DTO validation |
| **class-transformer** | 0.5.x | Object transformation |

### 2.3 DevOps & Tooling

| Tool | Purpose |
|------|---------|
| **pnpm** | Package manager |
| **ESLint** | Linting |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |
| **Jest** | Unit testing |
| **Playwright** | E2E testing |
| **Docker** | Containerization |

---

## 3. Data Models

### 3.1 Core Entities

#### LoanParameters
```typescript
interface LoanParameters {
  id: string; // UUID
  principal: number; // In rupees
  annualInterestRate: number; // Percentage (e.g., 8.5)
  tenureMonths: number; // Number of months
  startDate: Date; // Optional: loan start date
  createdAt: Date;
  updatedAt: Date;
}
```

#### AmortizationRow
```typescript
interface AmortizationRow {
  monthNumber: number; // 1 to n
  monthYear: string; // "Jan 2024"
  openingBalance: number;
  emiPaid: number;
  interestComponent: number;
  principalComponent: number;
  extraPayment: number; // Default 0
  totalPayment: number; // EMI + extra
  closingBalance: number;
  interestPercentage: number; // % of EMI going to interest
  cumulativeInterest: number;
  cumulativePrincipal: number;
  isBreakeven: boolean; // True if principal > interest
}
```

#### PrepaymentAction
```typescript
enum PrepaymentType {
  PERIODIC_EXTRA = 'periodic_extra',
  LUMPSUM = 'lumpsum',
  MISSED_PAYMENT = 'missed_payment',
}

enum ImpactStrategy {
  REDUCE_TENURE = 'reduce_tenure',
  REDUCE_EMI = 'reduce_emi',
}

interface PrepaymentAction {
  id: string; // UUID
  type: PrepaymentType;
  
  // For PERIODIC_EXTRA
  startMonth?: number;
  endMonth?: number;
  extraAmountPerMonth?: number;
  
  // For LUMPSUM
  paymentMonth?: number;
  lumpsumAmount?: number;
  
  // For MISSED_PAYMENT
  missedMonth?: number;
  penaltyAmount?: number;
  
  // Common
  impactStrategy: ImpactStrategy;
  createdAt: Date;
}
```

#### LoanScenario
```typescript
interface LoanScenario {
  id: string; // UUID
  name: string; // User-defined name
  loanParameters: LoanParameters;
  prepayments: PrepaymentAction[];
  
  // Calculated fields (stored for performance)
  originalEMI: number;
  modifiedEMI: number; // If reduce EMI strategy used
  originalTenure: number;
  modifiedTenure: number;
  totalInterestOriginal: number;
  totalInterestModified: number;
  totalSavings: number;
  
  createdAt: Date;
  updatedAt: Date;
}
```

#### CalculationResult
```typescript
interface CalculationResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  amortizationSchedule: AmortizationRow[];
  breakevenMonth: number;
  
  // If prepayments applied
  prepaymentSummary?: {
    totalExtraPaid: number;
    tenureReduced: number; // Months
    interestSaved: number;
    newEMI?: number;
    newTenure: number;
  };
}
```

### 3.2 Database Schema (PostgreSQL)

```sql
-- Users table (future use)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Loan scenarios table
CREATE TABLE loan_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Nullable for now
  name VARCHAR(255) NOT NULL,
  
  -- Loan parameters (JSON or separate columns)
  principal DECIMAL(12, 2) NOT NULL,
  annual_interest_rate DECIMAL(5, 2) NOT NULL,
  tenure_months INTEGER NOT NULL,
  start_date DATE,
  
  -- Calculated values
  original_emi DECIMAL(12, 2),
  modified_emi DECIMAL(12, 2),
  original_tenure INTEGER,
  modified_tenure INTEGER,
  total_interest_original DECIMAL(12, 2),
  total_interest_modified DECIMAL(12, 2),
  total_savings DECIMAL(12, 2),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Prepayment actions table
CREATE TABLE prepayment_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES loan_scenarios(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- 'periodic_extra', 'lumpsum', 'missed_payment'
  
  -- Type-specific fields (nullable based on type)
  start_month INTEGER,
  end_month INTEGER,
  extra_amount_per_month DECIMAL(12, 2),
  payment_month INTEGER,
  lumpsum_amount DECIMAL(12, 2),
  missed_month INTEGER,
  penalty_amount DECIMAL(12, 2),
  
  impact_strategy VARCHAR(50) NOT NULL, -- 'reduce_tenure', 'reduce_emi'
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_type CHECK (
    type IN ('periodic_extra', 'lumpsum', 'missed_payment')
  ),
  CONSTRAINT valid_strategy CHECK (
    impact_strategy IN ('reduce_tenure', 'reduce_emi')
  )
);

-- Indexes
CREATE INDEX idx_scenarios_user ON loan_scenarios(user_id);
CREATE INDEX idx_prepayments_scenario ON prepayment_actions(scenario_id);
CREATE INDEX idx_scenarios_created ON loan_scenarios(created_at DESC);
```

---

## 4. API Specification

### 4.1 REST API Endpoints

#### Base URL
```
Development: http://localhost:3001/api
Production: https://api.yourdomain.com/api
```

#### Endpoints

##### 1. Calculate Loan EMI
```http
POST /api/loan/calculate
Content-Type: application/json

Request Body:
{
  "principal": 5000000,
  "annualInterestRate": 8.5,
  "tenureMonths": 240,
  "startDate": "2024-01-01" // Optional
}

Response: 200 OK
{
  "emi": 43391,
  "totalInterest": 5413840,
  "totalAmount": 10413840,
  "breakevenMonth": 178,
  "amortizationSchedule": [
    {
      "monthNumber": 1,
      "monthYear": "Jan 2024",
      "openingBalance": 5000000,
      "emiPaid": 43391,
      "interestComponent": 35417,
      "principalComponent": 7974,
      "extraPayment": 0,
      "totalPayment": 43391,
      "closingBalance": 4992026,
      "interestPercentage": 81.63,
      "cumulativeInterest": 35417,
      "cumulativePrincipal": 7974,
      "isBreakeven": false
    },
    // ... 239 more rows
  ]
}
```

##### 2. Calculate with Prepayments
```http
POST /api/loan/calculate-with-prepayments
Content-Type: application/json

Request Body:
{
  "loanParameters": {
    "principal": 5000000,
    "annualInterestRate": 8.5,
    "tenureMonths": 240,
    "startDate": "2024-01-01"
  },
  "prepayments": [
    {
      "type": "periodic_extra",
      "startMonth": 1,
      "endMonth": 60,
      "extraAmountPerMonth": 10000,
      "impactStrategy": "reduce_tenure"
    },
    {
      "type": "lumpsum",
      "paymentMonth": 36,
      "lumpsumAmount": 200000,
      "impactStrategy": "reduce_tenure"
    }
  ]
}

Response: 200 OK
{
  "original": {
    "emi": 43391,
    "totalInterest": 5413840,
    "totalAmount": 10413840,
    "tenure": 240,
    "breakevenMonth": 178
  },
  "modified": {
    "emi": 43391,
    "totalInterest": 3245621,
    "totalAmount": 8845621,
    "tenure": 156,
    "breakevenMonth": 112
  },
  "comparison": {
    "tenureReduced": 84, // months
    "interestSaved": 2168219,
    "totalSavings": 2168219,
    "totalExtraPaid": 800000
  },
  "modifiedSchedule": [ /* ... */ ]
}
```

##### 3. Save Scenario
```http
POST /api/scenarios
Content-Type: application/json

Request Body:
{
  "name": "My Home Loan with Prepayments",
  "loanParameters": { /* ... */ },
  "prepayments": [ /* ... */ ]
}

Response: 201 Created
{
  "id": "uuid-here",
  "name": "My Home Loan with Prepayments",
  "createdAt": "2024-12-14T01:47:00Z"
}
```

##### 4. Get All Scenarios
```http
GET /api/scenarios

Response: 200 OK
{
  "scenarios": [
    {
      "id": "uuid-1",
      "name": "Scenario 1",
      "principal": 5000000,
      "tenure": 240,
      "totalSavings": 500000,
      "createdAt": "2024-12-01T00:00:00Z"
    },
    // ...
  ]
}
```

##### 5. Get Scenario by ID
```http
GET /api/scenarios/:id

Response: 200 OK
{
  "id": "uuid-1",
  "name": "My Scenario",
  "loanParameters": { /* ... */ },
  "prepayments": [ /* ... */ ],
  "calculationResult": { /* ... */ }
}
```

##### 6. Update Scenario
```http
PATCH /api/scenarios/:id
Content-Type: application/json

Request Body:
{
  "name": "Updated Name",
  "prepayments": [ /* ... */ ]
}

Response: 200 OK
```

##### 7. Delete Scenario
```http
DELETE /api/scenarios/:id

Response: 204 No Content
```

##### 8. Export Scenario
```http
GET /api/scenarios/:id/export?format=pdf
GET /api/scenarios/:id/export?format=csv
GET /api/scenarios/:id/export?format=excel

Response: 200 OK
Content-Type: application/pdf | text/csv | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="loan-scenario.{format}"
```

### 4.2 Error Responses

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

// Example
{
  "statusCode": 400,
  "message": ["Principal must be between 100000 and 100000000"],
  "error": "Bad Request",
  "timestamp": "2024-12-14T01:47:00.000Z",
  "path": "/api/loan/calculate"
}
```

---

## 5. Calculation Engine

### 5.1 Core Calculation Algorithms

#### EMI Calculation (Reducing Balance Method)

```typescript
import Decimal from 'decimal.js';

function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): number {
  const P = new Decimal(principal);
  const r = new Decimal(annualInterestRate).div(12).div(100); // Monthly rate
  const n = new Decimal(tenureMonths);
  
  // EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
  const onePlusR = r.plus(1);
  const onePlusRPowerN = onePlusR.pow(n);
  
  const numerator = P.mul(r).mul(onePlusRPowerN);
  const denominator = onePlusRPowerN.minus(1);
  
  const emi = numerator.div(denominator);
  
  return Math.round(emi.toNumber()); // Round to nearest rupee
}
```

#### Amortization Schedule Generation

```typescript
function generateAmortizationSchedule(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  startDate?: Date
): AmortizationRow[] {
  const emi = calculateEMI(principal, annualInterestRate, tenureMonths);
  const monthlyRate = new Decimal(annualInterestRate).div(12).div(100);
  
  let openingBalance = new Decimal(principal);
  let cumulativeInterest = new Decimal(0);
  let cumulativePrincipal = new Decimal(0);
  
  const schedule: AmortizationRow[] = [];
  
  for (let month = 1; month <= tenureMonths; month++) {
    const interest = openingBalance.mul(monthlyRate);
    let principal = new Decimal(emi).minus(interest);
    
    // Handle last month rounding adjustment
    if (month === tenureMonths) {
      principal = openingBalance;
    }
    
    const closingBalance = openingBalance.minus(principal);
    cumulativeInterest = cumulativeInterest.plus(interest);
    cumulativePrincipal = cumulativePrincipal.plus(principal);
    
    const interestPercentage = interest.div(emi).mul(100);
    const isBreakeven = principal.greaterThan(interest);
    
    schedule.push({
      monthNumber: month,
      monthYear: formatMonthYear(startDate, month),
      openingBalance: openingBalance.toNumber(),
      emiPaid: emi,
      interestComponent: Math.round(interest.toNumber()),
      principalComponent: Math.round(principal.toNumber()),
      extraPayment: 0,
      totalPayment: emi,
      closingBalance: closingBalance.toNumber(),
      interestPercentage: interestPercentage.toNumber(),
      cumulativeInterest: cumulativeInterest.toNumber(),
      cumulativePrincipal: cumulativePrincipal.toNumber(),
      isBreakeven,
    });
    
    openingBalance = closingBalance;
  }
  
  return schedule;
}
```

#### Apply Prepayments

```typescript
function applyPrepayments(
  baseSchedule: AmortizationRow[],
  prepayments: PrepaymentAction[],
  loanParams: LoanParameters
): CalculationResult {
  // Sort prepayments chronologically
  const sortedPrepayments = sortPrepaymentsByMonth(prepayments);
  
  let schedule = [...baseSchedule];
  let currentEMI = calculateEMI(
    loanParams.principal,
    loanParams.annualInterestRate,
    loanParams.tenureMonths
  );
  let remainingTenure = loanParams.tenureMonths;
  
  for (const prepayment of sortedPrepayments) {
    if (prepayment.type === 'periodic_extra') {
      schedule = applyPeriodicExtra(
        schedule,
        prepayment,
        currentEMI,
        loanParams.annualInterestRate
      );
    } else if (prepayment.type === 'lumpsum') {
      schedule = applyLumpsum(
        schedule,
        prepayment,
        currentEMI,
        loanParams.annualInterestRate
      );
    } else if (prepayment.type === 'missed_payment') {
      schedule = applyMissedPayment(
        schedule,
        prepayment,
        loanParams.annualInterestRate
      );
    }
    
    // Recalculate if strategy is reduce_emi
    if (prepayment.impactStrategy === 'reduce_emi') {
      const remainingBalance = schedule[prepayment.paymentMonth - 1].closingBalance;
      const remainingMonths = remainingTenure - prepayment.paymentMonth;
      currentEMI = calculateEMI(
        remainingBalance,
        loanParams.annualInterestRate,
        remainingMonths
      );
    }
  }
  
  // Trim schedule if loan closes early
  const finalSchedule = schedule.filter(row => row.closingBalance > 0);
  
  return {
    emi: currentEMI,
    totalInterest: sum(finalSchedule.map(r => r.interestComponent)),
    totalAmount: sum(finalSchedule.map(r => r.totalPayment)),
    amortizationSchedule: finalSchedule,
    breakevenMonth: findBreakevenMonth(finalSchedule),
  };
}
```

---

## 6. Frontend Architecture

### 6.1 Project Structure

```
/frontend
├── /app                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── /calculator
│   │   └── page.tsx       # Main calculator page
│   └── /scenarios
│       ├── page.tsx       # Scenarios list
│       └── [id]/page.tsx  # Scenario detail
├── /components
│   ├── /ui                # shadcn/ui components
│   ├── /calculator
│   │   ├── LoanForm.tsx
│   │   ├── AmortizationTable.tsx
│   │   ├── PrepaymentPanel.tsx
│   │   └── InteractiveTableRow.tsx
│   ├── /charts
│   │   ├── EMIBreakdownChart.tsx
│   │   ├── PrincipalOverTimeChart.tsx
│   │   └── ComparisonChart.tsx
│   └── /comparison
│       └── ComparisonView.tsx
├── /lib
│   ├── /calculations      # Calculation engine
│   │   ├── emi.ts
│   │   ├── amortization.ts
│   │   └── prepayment.ts
│   ├── /services
│   │   ├── api.ts         # API client
│   │   ├── export.ts      # Export services
│   │   └── storage.ts     # LocalStorage/IndexedDB
│   ├── /hooks
│   │   ├── useLoanCalculation.ts
│   │   └── useScenarios.ts
│   └── /utils
│       ├── formatting.ts
│       └── validation.ts
├── /store
│   └── loanStore.ts       # Zustand store
├── /types
│   └── index.ts           # TypeScript types
└── /styles
    └── globals.css
```

### 6.2 State Management (Zustand)

```typescript
// /store/loanStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LoanState {
  // Loan parameters
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  startDate: Date | null;
  
  // Calculated values
  emi: number | null;
  amortizationSchedule: AmortizationRow[];
  
  // Prepayments
  prepayments: PrepaymentAction[];
  
  // UI state
  selectedMonths: number[];
  comparisonMode: boolean;
  
  // Actions
  setLoanParameters: (params: Partial<LoanParameters>) => void;
  calculateLoan: () => void;
  addPrepayment: (prepayment: PrepaymentAction) => void;
  removePrepayment: (id: string) => void;
  toggleMonth: (month: number) => void;
  clearSelection: () => void;
  reset: () => void;
}

export const useLoanStore = create<LoanState>()(
  persist(
    (set, get) => ({
      // Initial state
      principal: 0,
      annualInterestRate: 0,
      tenureMonths: 0,
      startDate: null,
      emi: null,
      amortizationSchedule: [],
      prepayments: [],
      selectedMonths: [],
      comparisonMode: false,
      
      // Actions
      setLoanParameters: (params) => set((state) => ({ ...state, ...params })),
      
      calculateLoan: () => {
        const { principal, annualInterestRate, tenureMonths } = get();
        const emi = calculateEMI(principal, annualInterestRate, tenureMonths);
        const schedule = generateAmortizationSchedule(principal, annualInterestRate, tenureMonths);
        set({ emi, amortizationSchedule: schedule });
      },
      
      addPrepayment: (prepayment) => set((state) => ({
        prepayments: [...state.prepayments, prepayment]
      })),
      
      removePrepayment: (id) => set((state) => ({
        prepayments: state.prepayments.filter(p => p.id !== id)
      })),
      
      toggleMonth: (month) => set((state) => ({
        selectedMonths: state.selectedMonths.includes(month)
          ? state.selectedMonths.filter(m => m !== month)
          : [...state.selectedMonths, month]
      })),
      
      clearSelection: () => set({ selectedMonths: [] }),
      
      reset: () => set({
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
```

---

**End of Technical Specification Document**
