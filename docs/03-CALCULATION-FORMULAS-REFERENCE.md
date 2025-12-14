# Calculation Formulas & Mathematical Reference
# Home Loan Prepayment Calculator

**Version:** 1.0  
**Last Updated:** December 2024

---

## 1. Overview

This document provides detailed mathematical formulas, examples, and validation logic for all calculations in the Home Loan Prepayment Calculator. All calculations follow the **Reducing Balance Method** standard for Indian home loans with **monthly compounding**.

---

## 2. Core EMI Calculation

### 2.1 EMI Formula (Reducing Balance)

**Formula:**
```
EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]

Where:
  P = Principal loan amount (in ₹)
  r = Monthly interest rate = (Annual Rate / 12) / 100
  n = Loan tenure in months
```

**Step-by-Step Breakdown:**
```
1. Convert annual interest rate to monthly rate:
   r = (Annual Rate / 12) / 100
   
   Example: 8.5% annual
   r = (8.5 / 12) / 100 = 0.00708333

2. Calculate (1 + r):
   1 + r = 1.00708333

3. Calculate (1 + r)^n:
   For n = 240 months
   (1 + r)^n = (1.00708333)^240 = 5.5314

4. Calculate numerator:
   Numerator = P × r × (1 + r)^n
   = 5,000,000 × 0.00708333 × 5.5314
   = 196,133.67

5. Calculate denominator:
   Denominator = (1 + r)^n - 1
   = 5.5314 - 1
   = 4.5314

6. Calculate EMI:
   EMI = 196,133.67 / 4.5314
   = 43,291.13
   ≈ ₹43,291 (rounded to nearest rupee)
```

### 2.2 Worked Example

**Input:**
- Principal (P): ₹50,00,000
- Annual Interest Rate: 8.5%
- Tenure: 20 years (240 months)

**Calculation:**
```
r = (8.5 / 12) / 100 = 0.00708333
n = 240

(1 + r)^n = (1.00708333)^240 = 5.5314

Numerator = 5,000,000 × 0.00708333 × 5.5314 = 196,133.67
Denominator = 5.5314 - 1 = 4.5314

EMI = 196,133.67 / 4.5314 = 43,291.13 ≈ ₹43,291
```

**Output:**
- Monthly EMI: ₹43,291
- Total amount payable: ₹43,291 × 240 = ₹1,03,89,840
- Total interest: ₹1,03,89,840 - ₹50,00,000 = ₹53,89,840

### 2.3 Special Cases

#### Case 1: Zero Interest Rate
```
If interest rate = 0%:
EMI = Principal / Tenure

Example:
P = 5,000,000, n = 240
EMI = 5,000,000 / 240 = ₹20,833
```

#### Case 2: Very High Interest Rate
```
If interest rate approaches infinity:
EMI ≈ P × r (essentially paying only interest)

Example:
P = 5,000,000, Rate = 30% annual
r = 0.025
EMI ≈ 5,000,000 × 0.025 = ₹1,25,000
```

---

## 3. Amortization Schedule Calculations

### 3.1 Monthly Breakdown Formula

For each month `m`:

```
Opening Balance (m) = Closing Balance (m-1)
                      [For month 1: Opening Balance = Principal]

Interest Component (m) = Opening Balance (m) × Monthly Rate

Principal Component (m) = EMI - Interest Component (m)

Closing Balance (m) = Opening Balance (m) - Principal Component (m)

Interest Percentage (m) = (Interest Component / EMI) × 100

Cumulative Interest (m) = Sum of all Interest Components from month 1 to m

Cumulative Principal (m) = Sum of all Principal Components from month 1 to m
```

### 3.2 Month-by-Month Example

**Loan Details:**
- Principal: ₹50,00,000
- Interest: 8.5% p.a.
- EMI: ₹43,291

**First 6 Months:**

| Month | Opening Balance | EMI | Interest | Principal | Closing Balance | Interest % |
|-------|-----------------|-----|----------|-----------|-----------------|------------|
| 1 | 50,00,000 | 43,291 | 35,417 | 7,874 | 49,92,126 | 81.8% |
| 2 | 49,92,126 | 43,291 | 35,361 | 7,930 | 49,84,196 | 81.7% |
| 3 | 49,84,196 | 43,291 | 35,305 | 7,986 | 49,76,210 | 81.5% |
| 4 | 49,76,210 | 43,291 | 35,249 | 8,042 | 49,68,168 | 81.4% |
| 5 | 49,68,168 | 43,291 | 35,192 | 8,099 | 49,60,069 | 81.3% |
| 6 | 49,60,069 | 43,291 | 35,136 | 8,155 | 49,51,914 | 81.2% |

**Calculations for Month 1:**
```
Opening Balance = 50,00,000

Interest = 50,00,000 × (8.5 / 12 / 100)
         = 50,00,000 × 0.00708333
         = 35,416.65
         ≈ ₹35,417

Principal = 43,291 - 35,417 = ₹7,874

Closing Balance = 50,00,000 - 7,874 = ₹49,92,126

Interest % = (35,417 / 43,291) × 100 = 81.8%
```

### 3.3 Last Month Adjustment

The last month typically requires adjustment due to rounding:

```
Last Month Principal Component = Remaining Outstanding Balance

Last Month EMI = Last Month Interest + Last Month Principal

This ensures closing balance = ₹0
```

**Example:**
```
Month 240:
Opening Balance: ₹43,000
Interest: ₹305
Principal: ₹43,000 (force to pay off completely)
EMI: ₹43,305 (may differ from regular EMI)
Closing Balance: ₹0
```

---

## 4. Breakeven Month Calculation

### 4.1 Definition
Breakeven month is when **Principal Component > Interest Component** for the first time.

### 4.2 Formula
```
For each month m:
  If Principal Component (m) > Interest Component (m):
    Breakeven Month = m
    Break
```

### 4.3 Analytical Approximation
```
For reducing balance loans, breakeven occurs approximately at:

Breakeven Month ≈ n / 2 + (n × r / 4)

Where:
  n = total tenure
  r = monthly interest rate
```

**Example:**
```
n = 240 months
r = 0.00708333

Breakeven ≈ 240/2 + (240 × 0.00708333 / 4)
          ≈ 120 + 0.425
          ≈ 120 months

Actual breakeven: Month 178 (from exact calculation)
Note: Approximation is rough; exact calculation required
```

### 4.4 Example Calculation

For our standard loan:
```
Month 177:
- Opening: ₹12,73,445
- Interest: ₹9,023
- Principal: ₹34,268
- Principal < Interest ❌

Month 178:
- Opening: ₹12,39,177
- Interest: ₹8,777
- Principal: ₹34,514
- Principal > Interest ✅ BREAKEVEN!
```

---

## 5. Prepayment Calculations

### 5.1 Periodic Extra Payment (Reduce Tenure)

**Logic:**
For each month in the prepayment period, add extra payment to principal component.

```
Modified Principal Component (m) = Original Principal Component (m) + Extra Payment

Modified Closing Balance (m) = Opening Balance (m) - Modified Principal Component (m)

Recalculate subsequent months with new opening balance
Stop when Closing Balance ≤ 0
New Tenure = Month when loan closes
```

**Example:**
```
Original:
- Month 12 Opening: ₹48,97,668
- EMI: ₹43,291
- Interest: ₹34,692
- Principal: ₹8,599
- Closing: ₹48,89,069

With ₹10,000 extra payment (Reduce Tenure):
- Month 12 Opening: ₹48,97,668
- EMI: ₹43,291
- Extra: ₹10,000
- Total Payment: ₹53,291
- Interest: ₹34,692 (unchanged)
- Principal: ₹18,599 (₹8,599 + ₹10,000)
- Closing: ₹48,79,069 (₹10,000 less than original)

Month 13 now starts with ₹48,79,069 instead of ₹48,89,069
This propagates through all subsequent months, closing loan earlier
```

### 5.2 Periodic Extra Payment (Reduce EMI)

**Logic:**
After prepayment period ends, recalculate EMI based on remaining balance and tenure.

```
At end of prepayment period:
  Remaining Balance = Closing Balance after last prepayment month
  Remaining Months = Original Tenure - Current Month
  
  New EMI = Calculate EMI (Remaining Balance, Interest Rate, Remaining Months)
  
Continue schedule with New EMI for remaining months
```

**Example:**
```
After 60 months of ₹10,000 extra/month:
- Month 60 Closing Balance: ₹38,50,000 (hypothetical)
- Remaining Tenure: 240 - 60 = 180 months
- Interest Rate: 8.5%

New EMI = Calculate EMI(38,50,000, 8.5%, 180)
        = ₹37,845

From month 61 onwards, EMI = ₹37,845 (reduced from ₹43,291)
Loan still completes in month 240
```

### 5.3 Lumpsum Payment (Reduce Tenure)

**Logic:**
Apply lumpsum as extra principal in the specified month.

```
Modified Principal Component (lumpsum month) = 
  Original Principal Component + Lumpsum Amount

Modified Closing Balance = Opening Balance - Modified Principal Component

Continue with reduced balance, original EMI
Loan closes earlier
```

**Example:**
```
Lumpsum of ₹2,00,000 in month 36:

Month 36 Original:
- Opening: ₹46,88,234
- EMI: ₹43,291
- Interest: ₹33,224
- Principal: ₹10,067
- Closing: ₹46,78,167

Month 36 with Lumpsum:
- Opening: ₹46,88,234
- EMI: ₹43,291
- Lumpsum: ₹2,00,000
- Total Payment: ₹2,43,291
- Interest: ₹33,224 (unchanged)
- Principal: ₹2,10,067 (₹10,067 + ₹2,00,000)
- Closing: ₹44,78,167 (₹2,00,000 less)

Continues with ₹44,78,167 instead of ₹46,78,167
Loan closes approximately 25 months earlier
```

### 5.4 Lumpsum Payment (Reduce EMI)

**Logic:**
Apply lumpsum, then recalculate EMI for remaining tenure.

```
After lumpsum payment:
  New Outstanding Balance = Closing Balance after lumpsum
  Remaining Months = Original Tenure - Lumpsum Month
  
  New EMI = Calculate EMI(New Outstanding, Interest Rate, Remaining Months)
  
Continue with New EMI for remaining months
Loan completes at original tenure
```

**Example:**
```
Lumpsum ₹2,00,000 in month 36, Reduce EMI:
- After lumpsum: Outstanding = ₹44,78,167
- Remaining: 240 - 36 = 204 months

New EMI = Calculate EMI(44,78,167, 8.5%, 204)
        = ₹41,203

From month 37 onwards, EMI = ₹41,203
Total tenure remains 240 months
```

### 5.5 Missed Payment with Penalty

**Logic:**
Add penalty to outstanding balance, continue with original EMI.

```
In missed payment month:
  No EMI paid
  No principal reduction
  Penalty added to balance

Modified Closing Balance (missed month) = 
  Opening Balance + Penalty Amount
  
Next month Opening Balance = Modified Closing Balance (includes penalty)
```

**Example:**
```
Missed payment in month 18 with ₹5,000 penalty:

Month 18 Original:
- Opening: ₹48,36,821
- EMI: ₹43,291
- Interest: ₹34,261
- Principal: ₹9,030
- Closing: ₹48,27,791

Month 18 with Missed Payment:
- Opening: ₹48,36,821
- EMI Paid: ₹0
- Penalty: ₹5,000
- Closing: ₹48,41,821 (Opening + Penalty)

Month 19:
- Opening: ₹48,41,821 (₹14,030 more than if payment was made)
- Continue with original EMI
- Tenure extends by ~1 month or more
```

### 5.6 Hybrid Strategy Calculation

**Logic:**
Apply prepayments sequentially in chronological order.

```
1. Sort all prepayments by start month
2. Apply each prepayment in order:
   - For periodic: modify schedule for duration
   - For lumpsum: modify specific month
   - If reduce EMI: recalculate EMI after prepayment
3. Recalculate subsequent months after each prepayment
4. Continue until loan closes
```

**Example:**
```
Prepayment 1: Months 1-24, ₹5,000 extra, Reduce Tenure
Prepayment 2: Month 25, ₹1,00,000 lumpsum, Reduce EMI
Prepayment 3: Months 50-100, ₹10,000 extra, Reduce Tenure

Execution:
1. Apply ₹5,000 extra for months 1-24
   → Balance at month 24 is ₹X

2. Apply ₹1,00,000 lumpsum in month 25
   → Balance becomes ₹(X - 1,00,000)
   → Recalculate EMI for remaining (240-25) months
   → New EMI = ₹Y

3. Apply ₹10,000 extra with new EMI ₹Y for months 50-100
   → Continue until loan closes

Final tenure and savings calculated
```

---

## 6. Comparison Metrics Calculation

### 6.1 Total Interest Saved
```
Total Interest Saved = Original Total Interest - Modified Total Interest

Original Total Interest = Sum of all interest components (original schedule)
Modified Total Interest = Sum of all interest components (modified schedule)
```

### 6.2 Tenure Reduced
```
Tenure Reduced = Original Tenure - Modified Tenure (in months)

Where:
  Modified Tenure = Last month where Closing Balance > 0
```

### 6.3 Total Savings
```
Total Savings = Total Interest Saved

(Principal is paid in both cases, so savings = interest reduction)
```

### 6.4 Total Extra Paid
```
Total Extra Paid = Sum of all extra payments + Sum of all lumpsums
```

### 6.5 Return on Prepayment
```
ROI = (Total Interest Saved / Total Extra Paid) × 100

Example:
Extra Paid: ₹10,00,000
Interest Saved: ₹15,00,000
ROI = (15,00,000 / 10,00,000) × 100 = 150%
```

---

## 7. Validation & Edge Cases

### 7.1 Input Validation Formulas

#### Maximum EMI Check
```
If EMI > (Principal × 0.5):
  Warning: "Very high EMI. Please check interest rate and tenure."
```

#### Minimum Tenure for Given EMI
```
Minimum Months = Principal / (Maximum Affordable EMI - Monthly Interest)

Where Monthly Interest = Principal × Monthly Rate
```

#### Maximum Lumpsum
```
Maximum Lumpsum (month m) = Outstanding Balance (month m) - ₹1

(Cannot pay more than outstanding; must leave at least ₹1)
```

### 7.2 Rounding Rules

```
1. EMI: Round to nearest ₹1
2. Interest Component: Round to nearest ₹1
3. Principal Component: Round to nearest ₹1
4. Outstanding Balance: Exact decimal until final rounding
5. Percentages: Round to 2 decimal places
6. Last Month: Force closing balance to ₹0
```

### 7.3 Edge Case Handling

#### Case 1: Prepayment Closes Loan Early
```
If Closing Balance ≤ 0 in any month:
  - Set Closing Balance = 0
  - Trim schedule (remove subsequent months)
  - Adjust last month EMI to exact payoff amount
  - New Tenure = Current Month
```

#### Case 2: Prepayment Exceeds Outstanding
```
If Extra Payment > Outstanding Balance:
  - Cap Extra Payment = Outstanding Balance
  - Show warning to user
  - Close loan in that month
```

#### Case 3: Multiple Prepayments Same Month
```
Option A: Disallow (show error)
Option B: Merge prepayments for that month
```

#### Case 4: Floating Point Precision
```
Use Decimal.js library for all financial calculations
Precision: 10 decimal places during calculation
Round only for display
```

---

## 8. Test Cases & Validation

### 8.1 Standard Test Case

**Input:**
```
Principal: ₹50,00,000
Interest: 8.5% p.a.
Tenure: 240 months
```

**Expected Output:**
```
EMI: ₹43,291
Total Interest: ₹53,89,840
Total Payment: ₹1,03,89,840
Breakeven Month: ~178

Validation:
- Sum of all principal components = ₹50,00,000 (±₹10 for rounding)
- Month 240 closing balance = ₹0
- Each month: Closing = Opening - Principal Component
```

### 8.2 Zero Interest Test
```
Principal: ₹10,00,000
Interest: 0%
Tenure: 120 months

Expected:
EMI = 10,00,000 / 120 = ₹8,333
Interest = ₹0
Each month principal = ₹8,333
Breakeven = Month 1 (principal > 0 from start)
```

### 8.3 Prepayment Test
```
Base Loan: ₹50,00,000, 8.5%, 240 months
Prepayment: ₹10,000/month for 60 months, Reduce Tenure

Expected:
- Month 60: Outstanding reduced by ~₹6,00,000
- New tenure: ~205 months
- Interest saved: ~₹8,00,000
```

### 8.4 Lumpsum Test
```
Base Loan: ₹50,00,000, 8.5%, 240 months
Lumpsum: ₹5,00,000 in month 12, Reduce Tenure

Expected:
- Month 12: Outstanding reduced by ₹5,00,000
- New tenure: ~218 months
- Interest saved: ~₹6,50,000
```

---

## 9. Performance Benchmarks

### 9.1 Calculation Time Targets

```
EMI Calculation: < 1ms
Amortization Schedule (480 months): < 50ms
Prepayment Recalculation: < 100ms
Multiple Scenarios Comparison: < 200ms
```

### 9.2 Memory Usage

```
Amortization Schedule (480 months):
- Each row: ~200 bytes
- Total: 480 × 200 = 96 KB
- Acceptable for client-side calculation
```

---

## 10. Formula References & Standards

### 10.1 Indian Banking Standards
- Method: Reducing Balance
- Compounding: Monthly
- EMI Rounding: To nearest ₹1
- Standard followed by SBI, HDFC, ICICI, and other major banks

### 10.2 Alternative Formula (Flat Rate)
**Not used in this app, but for reference:**
```
Flat Rate EMI = (Principal + (Principal × Rate × Years)) / Total Months

This is simpler but not used for home loans in India.
```

### 10.3 Effective Interest Rate
```
Effective Annual Rate = ((1 + Monthly Rate)^12 - 1) × 100

For 8.5% nominal:
Effective = ((1 + 0.00708333)^12 - 1) × 100
          = (1.0884 - 1) × 100
          = 8.84%
```

---

**End of Calculation Formulas & Mathematical Reference Document**
