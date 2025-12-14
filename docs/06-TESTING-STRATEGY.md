# Testing Strategy & Test Cases
# Home Loan Prepayment Calculator

**Version:** 1.0  
**Last Updated:** December 2024

---

## 1. Testing Pyramid

```
                    ▲
                   ╱ ╲
                  ╱ E2E╲         5% - End-to-End Tests
                 ╱─────╲
                ╱       ╲
               ╱Integration╲     15% - Integration Tests
              ╱───────────╲
             ╱             ╲
            ╱  Unit Tests   ╲   80% - Unit Tests
           ╱─────────────────╲
          ▼                   ▼
```

### 1.1 Test Distribution
- **Unit Tests:** 80% (Fast, isolated, comprehensive)
- **Integration Tests:** 15% (API + Component interactions)
- **E2E Tests:** 5% (Critical user flows)

### 1.2 Coverage Targets
- **Overall Code Coverage:** 85%+
- **Critical Calculation Logic:** 100%
- **UI Components:** 70%+
- **API Endpoints:** 90%+

---

## 2. Unit Testing

### 2.1 Calculation Logic Tests

#### Test Suite: EMI Calculation

**File:** `lib/calculations/emi.test.ts`

```typescript
describe('calculateEMI', () => {
  test('should calculate EMI correctly for standard loan', () => {
    const emi = calculateEMI(5000000, 8.5, 240);
    expect(emi).toBe(43291);
  });

  test('should handle zero interest rate', () => {
    const emi = calculateEMI(1000000, 0, 120);
    expect(emi).toBe(8333); // Principal / Tenure
  });

  test('should round to nearest rupee', () => {
    const emi = calculateEMI(3725000, 7.25, 180);
    expect(Number.isInteger(emi)).toBe(true);
  });

  test('should throw error for invalid principal', () => {
    expect(() => calculateEMI(-1000, 8.5, 240)).toThrow('Invalid principal');
    expect(() => calculateEMI(0, 8.5, 240)).toThrow('Invalid principal');
  });

  test('should throw error for invalid interest rate', () => {
    expect(() => calculateEMI(5000000, -1, 240)).toThrow('Invalid interest rate');
    expect(() => calculateEMI(5000000, 31, 240)).toThrow('Interest rate out of range');
  });

  test('should throw error for invalid tenure', () => {
    expect(() => calculateEMI(5000000, 8.5, 5)).toThrow('Tenure too short');
    expect(() => calculateEMI(5000000, 8.5, 481)).toThrow('Tenure too long');
  });

  test('should handle edge case: 6 month minimum tenure', () => {
    const emi = calculateEMI(100000, 8.5, 6);
    expect(emi).toBeGreaterThan(0);
    expect(Number.isInteger(emi)).toBe(true);
  });

  test('should handle edge case: 40 year maximum tenure', () => {
    const emi = calculateEMI(10000000, 8.5, 480);
    expect(emi).toBeGreaterThan(0);
    expect(Number.isInteger(emi)).toBe(true);
  });

  test('should be deterministic for same inputs', () => {
    const emi1 = calculateEMI(5000000, 8.5, 240);
    const emi2 = calculateEMI(5000000, 8.5, 240);
    expect(emi1).toBe(emi2);
  });
});
```

#### Test Suite: Amortization Schedule

**File:** `lib/calculations/amortization.test.ts`

```typescript
describe('generateAmortizationSchedule', () => {
  const principal = 5000000;
  const rate = 8.5;
  const tenure = 240;

  test('should generate correct number of rows', () => {
    const schedule = generateAmortizationSchedule(principal, rate, tenure);
    expect(schedule).toHaveLength(240);
  });

  test('first month should have opening balance equal to principal', () => {
    const schedule = generateAmortizationSchedule(principal, rate, tenure);
    expect(schedule[0].openingBalance).toBe(principal);
  });

  test('last month should have closing balance of zero', () => {
    const schedule = generateAmortizationSchedule(principal, rate, tenure);
    const lastMonth = schedule[tenure - 1];
    expect(lastMonth.closingBalance).toBeLessThan(1); // Allow for rounding
  });

  test('sum of principal components should equal principal amount', () => {
    const schedule = generateAmortizationSchedule(principal, rate, tenure);
    const totalPrincipal = schedule.reduce((sum, row) => sum + row.principalComponent, 0);
    expect(Math.abs(totalPrincipal - principal)).toBeLessThan(10); // Within ₹10 for rounding
  });

  test('each month: closing = opening - principal', () => {
    const schedule = generateAmortizationSchedule(principal, rate, tenure);
    schedule.forEach(row => {
      const expected = row.openingBalance - row.principalComponent;
      expect(Math.abs(row.closingBalance - expected)).toBeLessThan(1);
    });
  });

  test('each month: EMI = interest + principal', () => {
    const schedule = generateAmortizationSchedule(principal, rate, tenure);
    schedule.forEach(row => {
      const sum = row.interestComponent + row.principalComponent;
      expect(Math.abs(row.emiPaid - sum)).toBeLessThan(1);
    });
  });

  test('cumulative interest should be monotonically increasing', () => {
    const schedule = generateAmortizationSchedule(principal, rate, tenure);
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].cumulativeInterest).toBeGreaterThan(schedule[i - 1].cumulativeInterest);
    }
  });

  test('interest percentage should decrease over time', () => {
    const schedule = generateAmortizationSchedule(principal, rate, tenure);
    const firstMonthPct = schedule[0].interestPercentage;
    const lastMonthPct = schedule[tenure - 1].interestPercentage;
    expect(lastMonthPct).toBeLessThan(firstMonthPct);
  });

  test('should identify breakeven month correctly', () => {
    const schedule = generateAmortizationSchedule(principal, rate, tenure);
    const breakevenIndex = schedule.findIndex(row => row.isBreakeven);
    expect(breakevenIndex).toBeGreaterThan(0);
    expect(schedule[breakevenIndex].principalComponent).toBeGreaterThan(
      schedule[breakevenIndex].interestComponent
    );
  });
});
```

#### Test Suite: Prepayment Logic

**File:** `lib/calculations/prepayment.test.ts`

```typescript
describe('applyPeriodicExtra - Reduce Tenure', () => {
  const baseLoan = {
    principal: 5000000,
    annualInterestRate: 8.5,
    tenureMonths: 240
  };

  test('should reduce tenure when extra payment applied', () => {
    const prepayment = {
      type: 'periodic_extra',
      startMonth: 1,
      endMonth: 60,
      extraAmountPerMonth: 10000,
      impactStrategy: 'reduce_tenure'
    };

    const result = calculateWithPrepayments(baseLoan, [prepayment]);
    expect(result.modified.tenure).toBeLessThan(baseLoan.tenureMonths);
  });

  test('should reduce total interest when extra payment applied', () => {
    const prepayment = {
      type: 'periodic_extra',
      startMonth: 1,
      endMonth: 60,
      extraAmountPerMonth: 10000,
      impactStrategy: 'reduce_tenure'
    };

    const result = calculateWithPrepayments(baseLoan, [prepayment]);
    expect(result.modified.totalInterest).toBeLessThan(result.original.totalInterest);
  });

  test('extra payment should appear in schedule', () => {
    const prepayment = {
      type: 'periodic_extra',
      startMonth: 12,
      endMonth: 24,
      extraAmountPerMonth: 5000,
      impactStrategy: 'reduce_tenure'
    };

    const result = calculateWithPrepayments(baseLoan, [prepayment]);
    const month12 = result.modifiedSchedule[11]; // 0-indexed
    expect(month12.extraPayment).toBe(5000);
  });
});

describe('applyLumpsum - Reduce Tenure', () => {
  test('should apply lumpsum in correct month', () => {
    const prepayment = {
      type: 'lumpsum',
      paymentMonth: 36,
      lumpsumAmount: 200000,
      impactStrategy: 'reduce_tenure'
    };

    const result = calculateWithPrepayments(baseLoan, [prepayment]);
    const month36 = result.modifiedSchedule[35];
    expect(month36.extraPayment).toBe(200000);
  });

  test('should reduce outstanding balance by lumpsum amount', () => {
    const prepayment = {
      type: 'lumpsum',
      paymentMonth: 36,
      lumpsumAmount: 200000,
      impactStrategy: 'reduce_tenure'
    };

    const result = calculateWithPrepayments(baseLoan, [prepayment]);
    const month36Original = result.originalSchedule[35];
    const month36Modified = result.modifiedSchedule[35];
    
    const difference = month36Original.closingBalance - month36Modified.closingBalance;
    expect(Math.abs(difference - 200000)).toBeLessThan(10);
  });
});

describe('applyMissedPayment', () => {
  test('should add penalty to outstanding balance', () => {
    const prepayment = {
      type: 'missed_payment',
      missedMonth: 18,
      penaltyAmount: 5000
    };

    const result = calculateWithPrepayments(baseLoan, [prepayment]);
    const month18Modified = result.modifiedSchedule[17];
    const month18Original = result.originalSchedule[17];
    
    expect(month18Modified.closingBalance).toBeGreaterThan(month18Original.closingBalance);
  });

  test('should extend tenure when payment missed', () => {
    const prepayment = {
      type: 'missed_payment',
      missedMonth: 18,
      penaltyAmount: 5000
    };

    const result = calculateWithPrepayments(baseLoan, [prepayment]);
    expect(result.modified.tenure).toBeGreaterThan(baseLoan.tenureMonths);
  });
});

describe('Hybrid Prepayment Strategy', () => {
  test('should apply multiple prepayments in order', () => {
    const prepayments = [
      {
        type: 'periodic_extra',
        startMonth: 1,
        endMonth: 24,
        extraAmountPerMonth: 5000,
        impactStrategy: 'reduce_tenure'
      },
      {
        type: 'lumpsum',
        paymentMonth: 36,
        lumpsumAmount: 100000,
        impactStrategy: 'reduce_emi'
      }
    ];

    const result = calculateWithPrepayments(baseLoan, prepayments);
    expect(result.modified.tenure).toBeLessThan(baseLoan.tenureMonths);
    expect(result.modified.emi).toBeLessThan(result.original.emi);
  });
});
```

### 2.2 Validation Tests

**File:** `lib/utils/validation.test.ts`

```typescript
describe('validateLoanParameters', () => {
  test('should accept valid parameters', () => {
    const params = { principal: 5000000, annualInterestRate: 8.5, tenureMonths: 240 };
    const result = validateLoanParameters(params);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject principal below minimum', () => {
    const params = { principal: 50000, annualInterestRate: 8.5, tenureMonths: 240 };
    const result = validateLoanParameters(params);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'principal', message: expect.any(String) })
    );
  });

  test('should reject principal above maximum', () => {
    const params = { principal: 150000000, annualInterestRate: 8.5, tenureMonths: 240 };
    const result = validateLoanParameters(params);
    expect(result.valid).toBe(false);
  });

  test('should reject invalid interest rate', () => {
    const params = { principal: 5000000, annualInterestRate: 35, tenureMonths: 240 };
    const result = validateLoanParameters(params);
    expect(result.valid).toBe(false);
  });
});
```

### 2.3 Component Tests

**File:** `components/calculator/LoanForm.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanForm from './LoanForm';

describe('LoanForm Component', () => {
  test('should render all input fields', () => {
    render(<LoanForm onCalculate={jest.fn()} />);
    
    expect(screen.getByLabelText(/principal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interest/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tenure/i)).toBeInTheDocument();
  });

  test('should format principal amount with Indian notation', async () => {
    render(<LoanForm onCalculate={jest.fn()} />);
    const input = screen.getByLabelText(/principal/i);
    
    await userEvent.type(input, '5000000');
    expect(input).toHaveValue('₹50,00,000');
  });

  test('should show validation error for invalid principal', async () => {
    render(<LoanForm onCalculate={jest.fn()} />);
    const input = screen.getByLabelText(/principal/i);
    
    await userEvent.type(input, '50000');
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(screen.getByText(/minimum.*1,00,000/i)).toBeInTheDocument();
    });
  });

  test('should disable calculate button when form invalid', () => {
    render(<LoanForm onCalculate={jest.fn()} />);
    const button = screen.getByRole('button', { name: /calculate/i });
    
    expect(button).toBeDisabled();
  });

  test('should enable calculate button when form valid', async () => {
    render(<LoanForm onCalculate={jest.fn()} />);
    
    await userEvent.type(screen.getByLabelText(/principal/i), '5000000');
    await userEvent.type(screen.getByLabelText(/interest/i), '8.5');
    await userEvent.type(screen.getByLabelText(/tenure/i), '240');
    
    const button = screen.getByRole('button', { name: /calculate/i });
    expect(button).toBeEnabled();
  });

  test('should call onCalculate with correct values', async () => {
    const mockCalculate = jest.fn();
    render(<LoanForm onCalculate={mockCalculate} />);
    
    await userEvent.type(screen.getByLabelText(/principal/i), '5000000');
    await userEvent.type(screen.getByLabelText(/interest/i), '8.5');
    await userEvent.type(screen.getByLabelText(/tenure/i), '240');
    
    const button = screen.getByRole('button', { name: /calculate/i });
    await userEvent.click(button);
    
    expect(mockCalculate).toHaveBeenCalledWith({
      principal: 5000000,
      annualInterestRate: 8.5,
      tenureMonths: 240
    });
  });
});
```

---

## 3. Integration Testing

### 3.1 API Integration Tests

**File:** `backend/test/integration/loan.integration.test.ts`

```typescript
describe('Loan API Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/loan/calculate', () => {
    test('should calculate EMI successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/loan/calculate')
        .send({
          principal: 5000000,
          annualInterestRate: 8.5,
          tenureMonths: 240
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.calculation.emi).toBe(43291);
    });

    test('should return 400 for invalid input', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/loan/calculate')
        .send({
          principal: -1000,
          annualInterestRate: 8.5,
          tenureMonths: 240
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/v1/scenarios', () => {
    test('should create and retrieve scenario', async () => {
      // Create scenario
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/scenarios')
        .send({
          name: 'Test Scenario',
          loanParameters: {
            principal: 5000000,
            annualInterestRate: 8.5,
            tenureMonths: 240
          },
          prepayments: []
        })
        .expect(201);

      const scenarioId = createResponse.body.data.id;

      // Retrieve scenario
      const getResponse = await request(app.getHttpServer())
        .get(`/api/v1/scenarios/${scenarioId}`)
        .expect(200);

      expect(getResponse.body.data.name).toBe('Test Scenario');
    });
  });
});
```

### 3.2 Component Integration Tests

```typescript
describe('Calculator Page Integration', () => {
  test('should calculate and display results', async () => {
    render(<CalculatorPage />);
    
    // Fill form
    await userEvent.type(screen.getByLabelText(/principal/i), '5000000');
    await userEvent.type(screen.getByLabelText(/interest/i), '8.5');
    await userEvent.type(screen.getByLabelText(/tenure/i), '240');
    
    // Submit
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/₹43,291/)).toBeInTheDocument();
    });
    
    // Check table rendered
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // Check charts rendered
    expect(screen.getByText(/EMI Breakdown/i)).toBeInTheDocument();
  });
});
```

---

## 4. End-to-End Testing

### 4.1 Critical User Flows (Playwright)

**File:** `e2e/loan-calculation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Loan Calculation Flow', () => {
  test('should complete full calculation flow', async ({ page }) => {
    await page.goto('/calculator');
    
    // Fill loan details
    await page.fill('[data-testid="principal-input"]', '5000000');
    await page.fill('[data-testid="interest-input"]', '8.5');
    await page.fill('[data-testid="tenure-input"]', '240');
    
    // Calculate
    await page.click('[data-testid="calculate-button"]');
    
    // Wait for results
    await expect(page.locator('[data-testid="emi-value"]')).toHaveText('₹43,291');
    
    // Verify table loaded
    await expect(page.locator('table')).toBeVisible();
    
    // Verify charts loaded
    await expect(page.locator('[data-testid="emi-breakdown-chart"]')).toBeVisible();
  });
});

test.describe('Prepayment Flow', () => {
  test('should add prepayment via table hover', async ({ page }) => {
    await page.goto('/calculator');
    
    // Calculate loan first
    await page.fill('[data-testid="principal-input"]', '5000000');
    await page.fill('[data-testid="interest-input"]', '8.5');
    await page.fill('[data-testid="tenure-input"]', '240');
    await page.click('[data-testid="calculate-button"]');
    
    // Wait for table
    await page.waitForSelector('table');
    
    // Hover over month 36
    await page.hover('[data-testid="table-row-36"]');
    
    // Click lumpsum button
    await page.click('[data-testid="add-lumpsum-36"]');
    
    // Fill lumpsum form
    await page.fill('[data-testid="lumpsum-amount"]', '200000');
    await page.click('[data-testid="strategy-reduce-tenure"]');
    await page.click('[data-testid="add-prepayment-button"]');
    
    // Verify prepayment added
    await expect(page.locator('[data-testid="prepayment-list"]')).toContainText('₹2,00,000');
    
    // Verify comparison shows savings
    await expect(page.locator('[data-testid="interest-saved"]')).toBeVisible();
  });
});

test.describe('Export Flow', () => {
  test('should export PDF successfully', async ({ page }) => {
    await page.goto('/calculator');
    
    // Calculate
    await page.fill('[data-testid="principal-input"]', '5000000');
    await page.fill('[data-testid="interest-input"]', '8.5');
    await page.fill('[data-testid="tenure-input"]', '240');
    await page.click('[data-testid="calculate-button"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="emi-value"]');
    
    // Click export
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-pdf-button"]');
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});
```

---

## 5. Performance Testing

### 5.1 Load Testing

**File:** `performance/load-test.js` (using k6)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 20 },   // Stay at 20 users
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
  },
};

export default function () {
  const payload = JSON.stringify({
    principal: 5000000,
    annualInterestRate: 8.5,
    tenureMonths: 240,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://localhost:3001/api/v1/loan/calculate', payload, params);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'calculation successful': (r) => JSON.parse(r.body).success === true,
    'EMI correct': (r) => JSON.parse(r.body).data.calculation.emi === 43291,
  });

  sleep(1);
}
```

### 5.2 Frontend Performance

```typescript
describe('Performance Tests', () => {
  test('should render 480-row table in < 500ms', async () => {
    const start = performance.now();
    
    const schedule = generateAmortizationSchedule(5000000, 8.5, 480);
    render(<AmortizationTable data={schedule} />);
    
    const end = performance.now();
    expect(end - start).toBeLessThan(500);
  });

  test('should calculate EMI in < 100ms', () => {
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      calculateEMI(5000000, 8.5, 240);
    }
    
    const end = performance.now();
    const avgTime = (end - start) / 1000;
    expect(avgTime).toBeLessThan(0.1);
  });
});
```

---

## 6. Accessibility Testing

### 6.1 Automated Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('LoanForm should have no accessibility violations', async () => {
    const { container } = render(<LoanForm onCalculate={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('AmortizationTable should have no accessibility violations', async () => {
    const schedule = generateAmortizationSchedule(5000000, 8.5, 240);
    const { container } = render(<AmortizationTable data={schedule} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 6.2 Keyboard Navigation Tests

```typescript
test('should navigate form with keyboard', async () => {
  render(<LoanForm onCalculate={jest.fn()} />);
  
  const principalInput = screen.getByLabelText(/principal/i);
  const interestInput = screen.getByLabelText(/interest/i);
  const tenureInput = screen.getByLabelText(/tenure/i);
  
  principalInput.focus();
  expect(principalInput).toHaveFocus();
  
  await userEvent.tab();
  expect(interestInput).toHaveFocus();
  
  await userEvent.tab();
  expect(tenureInput).toHaveFocus();
});
```

---

## 7. Test Data & Fixtures

### 7.1 Test Data Sets

**File:** `test/fixtures/loan-data.ts`

```typescript
export const validLoans = [
  {
    name: 'Standard 20-year loan',
    principal: 5000000,
    annualInterestRate: 8.5,
    tenureMonths: 240,
    expectedEMI: 43291,
  },
  {
    name: 'Short tenure',
    principal: 1000000,
    annualInterestRate: 7.5,
    tenureMonths: 60,
    expectedEMI: 20038,
  },
  {
    name: 'High interest',
    principal: 3000000,
    annualInterestRate: 12,
    tenureMonths: 180,
    expectedEMI: 36003,
  },
];

export const invalidLoans = [
  {
    principal: 50000, // Too low
    annualInterestRate: 8.5,
    tenureMonths: 240,
    error: 'Principal too low',
  },
  {
    principal: 150000000, // Too high
    annualInterestRate: 8.5,
    tenureMonths: 240,
    error: 'Principal too high',
  },
];

export const prepaymentScenarios = [
  {
    name: 'Conservative monthly extra',
    baseLoan: validLoans[0],
    prepayments: [
      {
        type: 'periodic_extra',
        startMonth: 1,
        endMonth: 60,
        extraAmountPerMonth: 5000,
        impactStrategy: 'reduce_tenure',
      },
    ],
    expectedTenureSaved: 30, // Approximate
  },
];
```

---

## 8. Continuous Integration

### 8.1 CI Pipeline (GitHub Actions)

**File:** `.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linter
        run: pnpm lint
      
      - name: Run unit tests
        run: pnpm test:unit --coverage
      
      - name: Run integration tests
        run: pnpm test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
      
      - name: Build application
        run: pnpm build
      
      - name: Run E2E tests
        run: pnpm test:e2e
```

---

## 9. Test Checklist

### 9.1 Before Release

- [ ] All unit tests passing (85%+ coverage)
- [ ] All integration tests passing
- [ ] Critical E2E flows passing
- [ ] Performance tests meeting thresholds
- [ ] Accessibility tests passing
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing completed (iOS Safari, Chrome Android)
- [ ] Load testing completed (50+ concurrent users)
- [ ] Security audit passed
- [ ] API documentation up to date

---

**End of Testing Strategy Document**
