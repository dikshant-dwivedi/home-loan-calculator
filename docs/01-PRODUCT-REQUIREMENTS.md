# Product Requirements Document (PRD)
# Home Loan Prepayment Calculator

**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Requirements Finalized  

---

## 1. Executive Summary

### 1.1 Product Vision
A comprehensive web-based home loan prepayment calculator designed for Indian consumers to understand their home loan amortization, visualize payment breakdowns, and simulate various prepayment strategies to optimize loan tenure and interest savings.

### 1.2 Target User
- **Primary User:** Individual consumer (you)
- **Profile:** General consumer with limited financial knowledge
- **Geography:** India
- **Use Case:** Personal home loan analysis and prepayment strategy planning

### 1.3 Core Value Proposition
Enable users to:
- Understand exactly how their home loan works month-by-month
- Visualize the principal vs interest breakdown over the loan lifecycle
- Experiment with multiple prepayment strategies using an intuitive interface
- Make informed decisions about prepayment timing and amounts
- Compare different scenarios side-by-side to maximize savings

---

## 2. Product Scope

### 2.1 In Scope - Phase 1

#### 2.1.1 Core Loan Calculation
- ✅ Calculate EMI based on principal, interest rate, and tenure
- ✅ Generate complete amortization schedule
- ✅ Calculate total interest payable over loan tenure
- ✅ Calculate total amount payable (principal + interest)
- ✅ Support Indian home loan calculation methodology (reducing balance)

#### 2.1.2 Visualization & Analysis
- ✅ Interactive amortization table (month-by-month breakdown)
- ✅ Multiple chart types showing principal vs interest over time
- ✅ Identify and highlight the "breakeven month" (when principal component > interest component)
- ✅ Interactive hover states showing detailed breakdowns
- ✅ Visual indicators for percentage of EMI going to interest vs principal

#### 2.1.3 Prepayment Simulation
- ✅ Periodic extra monthly payments (for specific time periods)
- ✅ One-time lumpsum payments (multiple instances)
- ✅ Missed payment scenarios with penalty calculation
- ✅ Choice between "Reduce Tenure" or "Reduce EMI" for each prepayment action
- ✅ Mix-and-match strategies across different periods

#### 2.1.4 Prepayment Input Methods (Dual Approach)
- ✅ **Method 1: Table-based interaction**
  - Hover over any row to access prepayment options
  - Drag-select multiple rows to apply prepayment for a period
  - Right-click or button-based actions for modifications
  
- ✅ **Method 2: Form-based input**
  - Traditional form fields to specify prepayment details
  - Date/month pickers for timing
  - Amount inputs with validation

#### 2.1.5 Comparison & Reporting
- ✅ Before vs After comparison views
- ✅ Key metrics dashboard:
  - Total interest saved
  - Tenure reduced (in months)
  - Total savings amount
  - New breakeven month
  - New EMI amount (if applicable)
- ✅ Multiple comparison charts
- ✅ Summary view and detailed view modes

#### 2.1.6 Data Persistence & Export
- ✅ Save scenarios for future reference (online & offline)
- ✅ Export to PDF
- ✅ Export to CSV
- ✅ Export to Excel
- ✅ Export charts as PNG images

#### 2.1.7 What-If Analysis
- ✅ "What if I increase monthly extra payment by ₹X?" calculator
- ✅ Quick scenario comparison tools
- ✅ Real-time recalculation as inputs change

### 2.2 Out of Scope - Phase 1
- ❌ Tax benefits calculation (future enhancement)
- ❌ AI-based optimal strategy recommendations (future enhancement)
- ❌ Multi-user accounts and sharing (future enhancement)
- ❌ Loan refinancing calculations (future enhancement)
- ❌ Integration with bank APIs (future enhancement)

### 2.3 Future Enhancements (Backlog)
- Support for floating interest rate changes over time
- Tax benefit calculator (Section 80C, 24B for India)
- Comparison with other investment opportunities
- Multi-currency support
- Collaborative scenario sharing
- Mobile app version

---

## 3. Functional Requirements

### 3.1 Loan Input Parameters

#### 3.1.1 Principal Amount
- **Input Type:** Number (currency)
- **Validation:**
  - Minimum: ₹1,00,000 (1 Lakh)
  - Maximum: ₹10,00,00,000 (10 Crores)
  - Increment: ₹1
- **Format:** Indian currency format (₹XX,XX,XXX)
- **Required:** Yes

#### 3.1.2 Interest Rate
- **Input Type:** Percentage (decimal up to 2 places)
- **Value Type:** Annual Percentage Rate (APR)
- **Validation:**
  - Minimum: 0.01%
  - Maximum: 30%
  - Increment: 0.01%
- **Required:** Yes
- **Note:** Currently single rate throughout loan tenure

#### 3.1.3 Loan Tenure
- **Input Type:** Dropdown or Number
- **Units:** Months or Years (with conversion)
- **Validation:**
  - Minimum: 6 months
  - Maximum: 40 years (480 months)
- **Required:** Yes

#### 3.1.4 Interest Compounding
- **Value:** Monthly (fixed for Indian home loans)
- **Display:** Show calculation methodology to user

### 3.2 EMI Calculation

#### 3.2.1 Formula
```
EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]

Where:
P = Principal loan amount
r = Monthly interest rate (Annual Rate / 12 / 100)
n = Loan tenure in months
```

#### 3.2.2 Calculation Method
- **Type:** Reducing Balance Method
- **Compounding:** Monthly
- **Rounding:** Round to nearest ₹1

#### 3.2.3 Output Display
- Monthly EMI amount
- Total amount payable
- Total interest payable
- Total principal (should match input)

### 3.3 Amortization Table

#### 3.3.1 Table Columns
| Column | Description | Calculation |
|--------|-------------|-------------|
| Month # | Sequential month number | 1 to n |
| Month-Year | Calendar month-year | Based on loan start date |
| Opening Balance | Principal at start of month | Closing balance from previous month |
| EMI Paid | Monthly installment | Fixed EMI amount |
| Interest Component | Interest portion of EMI | Opening Balance × Monthly Interest Rate |
| Principal Component | Principal portion of EMI | EMI - Interest Component |
| Extra Payment | Additional payment made | User input (if any) |
| Total Payment | EMI + Extra Payment | EMI + Extra Payment |
| Closing Balance | Remaining principal | Opening Balance - Principal Component - Extra Payment |
| Interest % | Percentage of EMI going to interest | (Interest Component / EMI) × 100 |
| Cumulative Interest | Total interest paid so far | Sum of all interest components till this month |
| Cumulative Principal | Total principal paid so far | Sum of all principal components till this month |

#### 3.3.2 Table Features
- **Pagination:** 12 rows per page (1 year), with navigation
- **Sorting:** Sortable by any column
- **Filtering:** Filter by year, milestone months
- **Search:** Search by month number or date
- **Highlighting:**
  - Breakeven month (where Principal Component > Interest Component)
  - Months with prepayments (different color)
  - Months with missed payments (different color)
  - Current month indicator (if loan is active)
- **Responsive:** Mobile-friendly horizontal scroll
- **Export:** Export visible/all rows to CSV/Excel

#### 3.3.3 Interactive Features (Method 1)
- **Hover State:**
  - Display action buttons: "Add Prepayment", "Add Lumpsum", "Mark Missed Payment"
  - Show tooltip with detailed breakdown
  
- **Click Actions:**
  - Single click: Show month details in sidebar
  - Right-click: Context menu with actions
  
- **Drag Selection:**
  - Click and drag to select multiple consecutive months
  - Display bulk action panel: "Apply extra ₹X/month for selected period"
  - Choose impact: Reduce Tenure / Reduce EMI
  - Apply and recalculate

### 3.4 Prepayment Mechanisms

#### 3.4.1 Prepayment Types

##### Type 1: Periodic Extra Monthly Payment
- **Description:** Pay additional amount every month for a specified period
- **Parameters:**
  - Start Month (dropdown or calendar)
  - End Month (dropdown or calendar)
  - Extra Amount per Month (₹)
  - Impact Choice: Reduce Tenure OR Reduce EMI
- **Example:** "Pay extra ₹5,000/month from Month 12 to Month 36, Reduce Tenure"

##### Type 2: One-Time Lumpsum Payment
- **Description:** Make a single large payment in a specific month
- **Parameters:**
  - Payment Month (dropdown or calendar)
  - Lumpsum Amount (₹)
  - Impact Choice: Reduce Tenure OR Reduce EMI
- **Example:** "Pay ₹2,00,000 in Month 24, Reduce EMI"

##### Type 3: Missed Payment with Penalty
- **Description:** Account for missed EMI with penalty charges
- **Parameters:**
  - Missed Month (dropdown or calendar)
  - Penalty Amount (₹ or % of EMI)
  - Penalty Type: Flat Amount OR Percentage of EMI
- **Example:** "Missed payment in Month 18, Penalty ₹5,000"
- **Impact:** Extends tenure, increases total interest

##### Type 4: Custom Monthly Payment (Advanced)
- **Description:** Specify exact payment for each month individually
- **Use Case:** Irregular income patterns
- **Parameters:**
  - Month-by-month amount specification
  - Validation: Must meet minimum EMI

#### 3.4.2 Hybrid Strategy Support
- **Capability:** Allow multiple prepayment actions with different strategies
- **Examples:**
  - Period 1 (Month 1-12): Extra ₹5,000/month → Reduce Tenure
  - Period 2 (Month 13-24): Lumpsum ₹2,00,000 → Reduce EMI
  - Period 3 (Month 25-36): Extra ₹10,000/month → Reduce Tenure
- **Execution:** Sequential application of prepayments in chronological order
- **Recalculation:** After each prepayment action, recalculate EMI/Tenure for remaining loan

#### 3.4.3 Input Methods

##### Method A: Table-Based Interaction (Visual)
1. **Single Row Hover:**
   - Hover over any month row
   - Show floating action buttons: [+Extra Payment] [+Lumpsum] [⚠️Missed]
   - Click button → Modal/panel opens with prepayment form
   
2. **Multi-Row Selection (Drag):**
   - Click and drag mouse over multiple rows
   - Selected rows highlight in blue
   - Action panel appears above/below selection
   - Input: "Add ₹____ extra per month for this period"
   - Choose: [Reduce Tenure] or [Reduce EMI]
   - Click Apply → Recalculate

3. **Right-Click Context Menu:**
   - Right-click on any row
   - Menu options:
     - "Add Extra Payment This Month"
     - "Add Lumpsum This Month"
     - "Mark as Missed Payment"
     - "View Month Details"

##### Method B: Form-Based Input (Traditional)
- **Location:** Sidebar or dedicated "Prepayments" tab
- **Structure:**
  - Section 1: "Add Periodic Extra Payment"
    - Fields: Start Month, End Month, Amount, Strategy
    - Button: [+ Add]
  
  - Section 2: "Add Lumpsum Payment"
    - Fields: Payment Month, Amount, Strategy
    - Button: [+ Add]
  
  - Section 3: "Mark Missed Payment"
    - Fields: Month, Penalty Type, Penalty Amount
    - Button: [+ Add]
  
  - Section 4: "Prepayment Summary"
    - List all added prepayments
    - Edit/Delete options for each
    - Reorder if needed

- **Validation:**
  - Cannot add prepayment for months beyond current tenure
  - Cannot add multiple conflicting prepayments for same month
  - Amount must be > 0

### 3.5 Visualization & Charts

#### 3.5.1 Chart Types

##### Chart 1: EMI Component Breakdown (Stacked Area Chart)
- **X-Axis:** Month Number / Time
- **Y-Axis:** Amount (₹)
- **Series:**
  - Interest Component (Red/Orange area)
  - Principal Component (Green/Blue area)
- **Interactivity:**
  - Hover: Show exact amounts for that month
  - Click: Highlight corresponding row in table
  - Zoom: Zoom into specific time periods
- **Annotations:**
  - Mark breakeven month with vertical line and label
  - Mark prepayment months with vertical markers

##### Chart 2: Outstanding Principal Over Time (Line Chart)
- **X-Axis:** Month Number / Time
- **Y-Axis:** Outstanding Principal (₹)
- **Series:**
  - Original Schedule (dashed line - if prepayments exist)
  - Modified Schedule (solid line)
- **Interactivity:**
  - Hover: Show outstanding balance
  - Annotations for prepayment drops

##### Chart 3: Interest % in EMI Over Time (Line Chart)
- **X-Axis:** Month Number
- **Y-Axis:** Percentage (0-100%)
- **Series:**
  - Interest percentage of EMI
- **Highlights:**
  - Mark 50% threshold (breakeven month)
  - Color gradient: Red (high %) → Green (low %)

##### Chart 4: Cumulative Interest vs Principal (Dual Line Chart)
- **X-Axis:** Month Number
- **Y-Axis:** Cumulative Amount (₹)
- **Series:**
  - Cumulative Interest Paid
  - Cumulative Principal Paid
- **Interactivity:**
  - Hover: Show exact cumulative amounts

##### Chart 5: Comparison Chart (Before vs After Prepayment)
- **Type:** Grouped Bar Chart or Side-by-Side Area Chart
- **Comparison Metrics:**
  - Total Interest Paid (Original vs Modified)
  - Total Tenure (Original vs Modified)
  - Total Amount Paid
  - Breakeven Month
- **Visual:** Clear color differentiation (Blue for Original, Green for Modified)

##### Chart 6: Monthly Payment Distribution (Pie Chart)
- **Purpose:** Show overall loan composition
- **Segments:**
  - Total Principal (should equal loan amount)
  - Total Interest Paid
- **Variations:**
  - Original loan pie
  - Modified loan pie (with prepayments)
- **Display:** Side-by-side comparison

##### Chart 7: Savings Waterfall Chart
- **Purpose:** Visualize how prepayments translate to savings
- **Bars:**
  - Original Total Payment
  - Savings from Prepayment 1 (negative bar)
  - Savings from Prepayment 2 (negative bar)
  - ...
  - Final Total Payment
- **Interactivity:** Click each bar to see details

#### 3.5.2 Chart Library & Tech Stack
- **Library:** Chart.js, Recharts, or D3.js (for advanced interactivity)
- **Responsiveness:** All charts must be mobile-responsive
- **Color Scheme:** Consistent color palette across all charts
- **Accessibility:** Support screen readers, keyboard navigation

#### 3.5.3 Export Functionality
- Export individual charts as PNG (1920x1080)
- Export all charts as PDF report
- Include data tables with charts in exports

### 3.6 Comparison & Reporting

#### 3.6.1 Summary View Metrics
Display key metrics in card/tile format:

| Metric | Original Loan | With Prepayments | Difference | % Change |
|--------|---------------|------------------|------------|----------|
| **Total EMI Amount** | Calculated | Calculated | Savings | % |
| **Total Interest** | Calculated | Calculated | Savings | % |
| **Total Amount Paid** | Calculated | Calculated | Savings | % |
| **Loan Tenure** | XX months | YY months | Reduced by ZZ | % |
| **Breakeven Month** | Month XX | Month YY | Earlier by ZZ | - |
| **Average Monthly Interest** | ₹XX | ₹YY | ₹ZZ less | % |

#### 3.6.2 Detailed View
- Expandable sections for each metric
- Show calculation methodology
- Month-by-month impact analysis
- Graphical representation of each metric

#### 3.6.3 Comparison Modes
- **Toggle View:** Switch between Original and Modified schedules
- **Side-by-Side:** Display both schedules in parallel columns
- **Overlay:** Overlay charts with transparency
- **Diff View:** Highlight only the differences

### 3.7 What-If Scenarios

#### 3.7.1 Quick What-If Calculator
**Feature:** Instant calculation sidebar

**Inputs:**
- "What if I add ₹______ extra every month?"
- "What if I make a ₹______ lumpsum in month ____?"
- "What if I increase EMI by _____%?"

**Outputs (Real-time):**
- Tenure reduced by: XX months
- Interest saved: ₹XX,XXX
- New EMI: ₹XX,XXX (if applicable)
- New total payment: ₹XX,XXX

**Action:** [Apply This Scenario] button to commit changes

#### 3.7.2 Scenario Comparison
- Save up to 5 different scenarios
- Name each scenario
- Compare all scenarios side-by-side in a table
- Visual chart comparing all scenarios
- Mark one as "Active" scenario

### 3.8 Data Persistence

#### 3.8.1 Local Storage (Offline)
- Save current loan parameters
- Save all prepayment configurations
- Save custom scenarios
- Auto-save on every change
- IndexedDB for larger datasets

#### 3.8.2 Cloud Storage (Online)
- User account not required for Phase 1
- Optional: Save to backend for future use
- Store calculation history
- Enable cross-device access (future)

#### 3.8.3 Export Formats

##### PDF Export
- **Contents:**
  - Loan summary page
  - Full amortization table
  - All charts
  - Comparison summary
  - Prepayment schedule
- **Format:** Professional report layout
- **Branding:** App logo and generation date

##### CSV Export
- **Files:**
  - `loan-schedule.csv`: Full amortization table
  - `prepayments.csv`: List of all prepayments
  - `comparison.csv`: Before vs after metrics
- **Format:** Standard CSV with headers

##### Excel Export
- **Sheets:**
  - Sheet 1: Loan Parameters & Summary
  - Sheet 2: Original Amortization Schedule
  - Sheet 3: Modified Amortization Schedule (if prepayments exist)
  - Sheet 4: Prepayment Details
  - Sheet 5: Comparison Metrics
- **Features:** Include formulas, formatting, charts

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **Calculation Speed:** EMI calculation < 100ms
- **Table Rendering:** Render 480 rows < 500ms
- **Chart Rendering:** Render all charts < 1s
- **Export Generation:** PDF generation < 3s for full report
- **Interaction Response:** All UI interactions < 200ms

### 4.2 Usability
- **Learning Curve:** First-time user should understand basic functionality in < 5 minutes
- **Tooltips:** Provide helpful tooltips for all financial terms
- **Help Section:** Inline help for complex features
- **Error Messages:** Clear, actionable error messages
- **Undo/Redo:** Support undo for prepayment additions

### 4.3 Reliability
- **Calculation Accuracy:** 100% accurate to the rupee
- **Data Persistence:** No data loss on page refresh (local storage)
- **Error Handling:** Graceful handling of all edge cases
- **Validation:** Client-side and server-side validation

### 4.4 Compatibility
- **Browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Devices:** Desktop, Tablet, Mobile (responsive design)
- **Screen Sizes:** 320px to 4K
- **Offline Mode:** Full functionality offline (PWA)

### 4.5 Security
- **Data Privacy:** All calculations client-side (no sensitive data to server)
- **Storage:** Encrypted local storage
- **HTTPS:** Enforce HTTPS in production
- **No PII:** Do not collect personally identifiable information

### 4.6 Accessibility
- **WCAG 2.1:** Level AA compliance
- **Keyboard Navigation:** Full keyboard support
- **Screen Readers:** Compatible with NVDA, JAWS, VoiceOver
- **Color Contrast:** Minimum 4.5:1 ratio
- **Focus Indicators:** Clear focus states

---

## 5. Validation Rules

### 5.1 Input Validation

#### Principal Amount
- Required field
- Must be numeric
- Range: ₹1,00,000 to ₹10,00,00,000
- Error Messages:
  - "Principal amount is required"
  - "Principal must be at least ₹1,00,000"
  - "Principal cannot exceed ₹10,00,00,000"

#### Interest Rate
- Required field
- Must be numeric (decimal allowed)
- Range: 0.01% to 30%
- Format: Up to 2 decimal places
- Error Messages:
  - "Interest rate is required"
  - "Interest rate must be between 0.01% and 30%"
  - "Interest rate can have maximum 2 decimal places"

#### Tenure
- Required field
- Must be numeric
- Range: 6 months to 480 months (40 years)
- Error Messages:
  - "Loan tenure is required"
  - "Minimum tenure is 6 months"
  - "Maximum tenure is 40 years (480 months)"

### 5.2 Prepayment Validation

#### Extra Monthly Payment
- Amount must be > 0
- Cannot exceed outstanding principal
- Start month must be >= 1
- End month must be <= remaining tenure
- End month must be > Start month
- Cannot overlap with existing prepayment periods (or handle merging)

#### Lumpsum Payment
- Amount must be > 0
- Cannot exceed outstanding principal at that month
- Month must be valid (1 to remaining tenure)
- Warning if lumpsum > 50% of outstanding principal

#### Missed Payment
- Can only mark future months as missed (not retroactive)
- Penalty must be >= 0
- Penalty % cannot exceed 100% of EMI

### 5.3 Calculation Validation
- Ensure EMI × Tenure >= Principal (sanity check)
- Verify that closing balance reaches ₹0 at tenure end
- Ensure sum of all principal components = Original principal
- Validate no negative balances in any month

---

## 6. User Stories

### 6.1 Core Functionality

**US-001: Calculate Basic EMI**
- **As a** user
- **I want to** input my loan amount, interest rate, and tenure
- **So that** I can see my monthly EMI amount and total interest payable
- **Acceptance Criteria:**
  - Given valid inputs, EMI is calculated correctly
  - Total interest and total amount are displayed
  - Amortization table is generated

**US-002: View Amortization Schedule**
- **As a** user
- **I want to** see a detailed month-by-month breakdown of my loan
- **So that** I understand how much principal and interest I pay each month
- **Acceptance Criteria:**
  - Table shows all months from 1 to tenure
  - Each row shows opening balance, EMI, interest, principal, closing balance
  - Interest percentage is displayed for each month

**US-003: Identify Breakeven Month**
- **As a** user
- **I want to** know in which month my principal payment exceeds interest payment
- **So that** I can understand when I start paying more towards the loan itself
- **Acceptance Criteria:**
  - Breakeven month is highlighted in the table
  - Visual indicator in charts
  - Summary metric displays breakeven month number

### 6.2 Prepayment Features

**US-004: Add Periodic Extra Payment**
- **As a** user
- **I want to** specify a period where I'll pay extra amount every month
- **So that** I can see how this reduces my tenure or EMI
- **Acceptance Criteria:**
  - Can select start and end month
  - Can input extra amount per month
  - Can choose to reduce tenure or reduce EMI
  - Amortization table updates with new values
  - Comparison shows savings

**US-005: Add Lumpsum Payment**
- **As a** user
- **I want to** add a one-time large payment in a specific month
- **So that** I can see the impact on my loan
- **Acceptance Criteria:**
  - Can select month for lumpsum
  - Can input lumpsum amount
  - Can choose impact strategy
  - Table updates showing lumpsum in that month
  - Comparison shows tenure/EMI reduction

**US-006: Interactive Table Prepayment (Hover)**
- **As a** user
- **I want to** hover over a month in the table and add prepayment
- **So that** I can quickly experiment without forms
- **Acceptance Criteria:**
  - Hovering shows action buttons
  - Clicking button opens inline form
  - Changes apply immediately after confirmation

**US-007: Drag-Select Bulk Prepayment**
- **As a** user
- **I want to** select multiple months by dragging
- **So that** I can apply prepayment to an entire period easily
- **Acceptance Criteria:**
  - Dragging selects consecutive months
  - Bulk action panel appears
  - Can apply same prepayment to all selected months
  - Cancellation option available

### 6.3 Visualization

**US-008: View Principal vs Interest Chart**
- **As a** user
- **I want to** see a visual chart of principal and interest over time
- **So that** I can understand the composition of my payments visually
- **Acceptance Criteria:**
  - Stacked area chart shows both components
  - Hovering shows exact amounts
  - Breakeven month is marked

**US-009: Compare Before and After Prepayment**
- **As a** user
- **I want to** see side-by-side comparison of original vs modified loan
- **So that** I can understand the exact impact of my prepayments
- **Acceptance Criteria:**
  - Comparison table shows key metrics
  - Charts overlay original and modified schedules
  - Savings are highlighted in green

### 6.4 What-If Analysis

**US-010: Quick What-If Calculator**
- **As a** user
- **I want to** quickly test "what if I add ₹5000 extra per month"
- **So that** I can make quick decisions without modifying my main calculation
- **Acceptance Criteria:**
  - Sidebar calculator with input field
  - Real-time calculation of impact
  - Option to apply the scenario
  - Does not affect main calculation unless applied

### 6.5 Export & Save

**US-011: Export to PDF**
- **As a** user
- **I want to** export my loan analysis as a PDF
- **So that** I can save it or share it
- **Acceptance Criteria:**
  - PDF includes all charts, tables, and summaries
  - Professional formatting
  - Download initiates within 3 seconds

**US-012: Save Scenario**
- **As a** user
- **I want to** save my current loan configuration
- **So that** I can return to it later
- **Acceptance Criteria:**
  - Scenario is saved to local storage
  - Can load saved scenario
  - Can name scenarios

---

## 7. Edge Cases & Error Scenarios

### 7.1 Input Edge Cases
- **Zero Interest Rate:** Handle gracefully (simple division of principal by tenure)
- **Very High Interest Rate:** Ensure EMI doesn't exceed reasonable limits
- **Very Short Tenure:** 6 months - ensure calculations work
- **Very Long Tenure:** 40 years - ensure table renders efficiently (pagination)
- **Exact Divisibility:** Principal exactly divisible by tenure with zero interest

### 7.2 Prepayment Edge Cases
- **Prepayment Exceeds Outstanding:** Warning + cap at outstanding principal
- **Prepayment in Last Month:** Handle tenure completion
- **Multiple Prepayments Same Month:** Merge or disallow
- **Prepayment Fully Pays Off Loan Mid-Tenure:** End amortization early
- **Missed Payment After Prepayment:** Recalculate appropriately

### 7.3 Calculation Edge Cases
- **Rounding Errors:** Ensure last month adjustment for rounding
- **Negative Balance:** Should never occur, add safeguards
- **Infinite Loop:** Prevent in calculation logic
- **Browser Precision Limits:** Use decimal libraries for financial calculations

### 7.4 UI Edge Cases
- **Very Long Table:** Pagination, virtualization for performance
- **No Prepayments:** Show empty state, guide user
- **Too Many Scenarios:** Limit to 5, show warning
- **Mobile Gestures:** Ensure drag-select works or use alternative
- **Print View:** Optimize layout for printing

---

## 8. Success Metrics

### 8.1 User Satisfaction
- User can successfully calculate EMI on first attempt: 100%
- User understands breakeven month concept: 90%+
- User successfully adds prepayment: 95%+

### 8.2 Technical Performance
- Page load time: < 2 seconds
- Time to interactive: < 3 seconds
- Calculation accuracy: 100%
- Zero calculation errors in production

### 8.3 Feature Usage
- % of users who try prepayment simulation: Target 80%+
- % of users who export results: Target 40%+
- % of users who save scenarios: Target 30%+

---

## 9. Glossary

- **EMI:** Equated Monthly Installment - Fixed monthly payment for loan
- **Principal:** The actual loan amount borrowed
- **Interest:** Cost of borrowing, paid to lender
- **Tenure:** Duration of the loan in months
- **Amortization:** Gradual reduction of loan through scheduled payments
- **Reducing Balance:** Interest calculated on remaining principal each month
- **Breakeven Month:** Month where principal component > interest component in EMI
- **Prepayment:** Extra payment beyond regular EMI to reduce loan faster
- **Lumpsum:** One-time large payment
- **APR:** Annual Percentage Rate

---

**End of Product Requirements Document**
