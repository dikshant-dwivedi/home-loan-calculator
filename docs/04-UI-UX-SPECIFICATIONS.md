# UI/UX Specifications
# Home Loan Prepayment Calculator

**Version:** 1.0  
**Last Updated:** December 2024

---

## 1. Design Principles

### 1.1 Core Principles
- **Clarity First:** Financial data must be immediately understandable
- **Progressive Disclosure:** Show basic info first, details on demand
- **Interactive Exploration:** Enable hands-on experimentation with prepayment scenarios
- **Visual Hierarchy:** Most important metrics prominently displayed
- **Responsive Design:** Seamless experience across all devices
- **Accessibility:** WCAG 2.1 AA compliance minimum

### 1.2 Color Palette

```
Primary Colors:
- Primary Blue: #2563EB (Interactive elements, CTAs)
- Primary Dark: #1E40AF (Headers, emphasis)
- Primary Light: #DBEAFE (Backgrounds, highlights)

Success/Growth:
- Success Green: #10B981 (Savings, positive outcomes)
- Light Green: #D1FAE5 (Success backgrounds)

Warning/Interest:
- Warning Orange: #F59E0B (Interest components, warnings)
- Light Orange: #FEF3C7 (Warning backgrounds)

Error/Loss:
- Error Red: #EF4444 (Missed payments, errors)
- Light Red: #FEE2E2 (Error backgrounds)

Neutrals:
- Gray 900: #111827 (Primary text)
- Gray 700: #374151 (Secondary text)
- Gray 500: #6B7280 (Tertiary text)
- Gray 300: #D1D5DB (Borders)
- Gray 100: #F3F4F6 (Backgrounds)
- White: #FFFFFF (Backgrounds, cards)

Chart Colors:
- Principal: #10B981 (Green)
- Interest: #F59E0B (Orange)
- Original Schedule: #94A3B8 (Gray, dashed)
- Modified Schedule: #2563EB (Blue)
```

### 1.3 Typography

```
Font Family: 'Inter', system-ui, sans-serif

Headings:
- H1: 36px / 2.25rem, Bold (700), 44px line-height
- H2: 30px / 1.875rem, SemiBold (600), 36px line-height
- H3: 24px / 1.5rem, SemiBold (600), 32px line-height
- H4: 20px / 1.25rem, Medium (500), 28px line-height

Body:
- Large: 18px / 1.125rem, Regular (400), 28px line-height
- Base: 16px / 1rem, Regular (400), 24px line-height
- Small: 14px / 0.875rem, Regular (400), 20px line-height
- XSmall: 12px / 0.75rem, Regular (400), 16px line-height

Numbers (Tabular):
- Use tabular-nums for all financial figures
- Bold (700) for key metrics
- Regular (400) for table values
```

### 1.4 Spacing System

```
Based on 8px grid:

- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)
```

---

## 2. Page Layouts

### 2.1 Main Calculator Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                       │
│ [Logo]  Home Loan Calculator          [Save] [Export] [Menu]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─────────────────┐  ┌────────────────────────────────────┐│
│ │                 │  │                                     ││
│ │  Loan Input     │  │    Key Metrics Dashboard           ││
│ │  Form           │  │                                     ││
│ │                 │  │  ┌──────┐ ┌──────┐ ┌──────┐       ││
│ │  [Principal]    │  │  │ EMI  │ │Total │ │Total │       ││
│ │  [Interest]     │  │  │43,291│ │ Int. │ │ Amt. │       ││
│ │  [Tenure]       │  │  └──────┘ └──────┘ └──────┘       ││
│ │                 │  │                                     ││
│ │  [Calculate]    │  │  Breakeven Month: 178              ││
│ │                 │  │                                     ││
│ └─────────────────┘  └────────────────────────────────────┘│
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐│
│ │                                                          ││
│ │          Charts Section (Tabs)                          ││
│ │                                                          ││
│ │  [EMI Breakdown] [Principal Over Time] [Comparison]     ││
│ │                                                          ││
│ │  [Chart Area - Responsive Recharts Visualization]       ││
│ │                                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐│
│ │                                                          ││
│ │          Interactive Amortization Table                 ││
│ │                                                          ││
│ │  [Search] [Filter by Year] [Items per page: 12]         ││
│ │                                                          ││
│ │  Month | Date    | Opening | EMI | Interest | Principal││
│ │  ──────────────────────────────────────────────────────││
│ │    1   | Jan'24  | 50,00,000 | ... | ... | ...         ││
│ │    2   | Feb'24  | ...       | ... | ... | ...         ││
│ │                                                          ││
│ │  [Pagination: < 1 2 3 ... 20 >]                         ││
│ │                                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐│
│ │                                                          ││
│ │          Prepayment Configuration Panel                 ││
│ │                                                          ││
│ │  [+ Add Periodic Extra] [+ Add Lumpsum] [+ Mark Missed] ││
│ │                                                          ││
│ │  Current Prepayments:                                   ││
│ │  • Months 1-60: ₹10,000/month (Reduce Tenure) [Edit][X]││
│ │  • Month 36: ₹2,00,000 lumpsum (Reduce Tenure) [Edit][X]││
│ │                                                          ││
│ │  [Apply All Prepayments]                                ││
│ │                                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Responsive Breakpoints

```
Mobile: 320px - 767px (Single column)
Tablet: 768px - 1023px (Mixed layout)
Desktop: 1024px - 1439px (Two column)
Large Desktop: 1440px+ (Three column with sidebar)
```

#### Mobile Layout Adjustments:
- Stack all sections vertically
- Collapse table to card view
- Bottom sheet for prepayment forms
- Sticky header with hamburger menu
- Swipeable chart carousel

#### Tablet Layout:
- Two-column grid where appropriate
- Horizontal scrollable table
- Modal dialogs for forms
- Collapsible sidebar

---

## 3. Component Specifications

### 3.1 Loan Input Form

**Visual Design:**
```
┌────────────────────────────────┐
│ Loan Details                   │
├────────────────────────────────┤
│                                │
│ Principal Amount *             │
│ ┌────────────────────────────┐│
│ │ ₹ 50,00,000               ││
│ └────────────────────────────┘│
│ Min: ₹1L | Max: ₹10Cr         │
│                                │
│ Annual Interest Rate (%) *     │
│ ┌────────────────────────────┐│
│ │ 8.5                        ││
│ └────────────────────────────┘│
│ Range: 0.01% - 30%             │
│                                │
│ Loan Tenure *                  │
│ ┌──────────┐  ┌──────────────┐│
│ │ 20       │  │ Years    ▼   ││
│ └──────────┘  └──────────────┘│
│ Min: 6 months | Max: 40 years  │
│                                │
│ Start Date (Optional)          │
│ ┌────────────────────────────┐│
│ │ 📅 Jan 2024               ││
│ └────────────────────────────┘│
│                                │
│     [Calculate EMI]            │
│                                │
└────────────────────────────────┘
```

**Interactions:**
- **Principal Input:**
  - Number input with rupee symbol prefix
  - Format: Indian currency notation (₹XX,XX,XXX)
  - Real-time formatting as user types
  - Validation on blur
  - Slider option for quick adjustment

- **Interest Rate:**
  - Number input with % suffix
  - Step: 0.01
  - Tooltip: "Enter annual interest rate (e.g., 8.5 for 8.5%)"
  
- **Tenure:**
  - Two inputs: Number + Dropdown (Months/Years)
  - Auto-convert between months and years
  - If Years selected, show months equivalent below

- **Calculate Button:**
  - Primary button, full width
  - Disabled if form invalid
  - Loading spinner while calculating
  - Keyboard shortcut: Cmd/Ctrl + Enter

**Validation States:**
```
Valid: Green border, checkmark icon
Invalid: Red border, error message below
Warning: Orange border, warning icon
```

### 3.2 Key Metrics Dashboard

**Design:**
```
┌─────────────────────────────────────────────────────────┐
│                  Loan Summary                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Monthly EMI  │  │ Total Interest│  │ Total Amount │ │
│  │              │  │               │  │              │ │
│  │  ₹43,291     │  │  ₹53,89,840  │  │ ₹1,03,89,840 │ │
│  │              │  │               │  │              │ │
│  │  Every month │  │  Over 20 yrs  │  │  Principal + │ │
│  │              │  │               │  │  Interest    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ⚖️ Breakeven Month: Month 178 (Nov 2038)        │  │
│  │ After this, you pay more principal than interest │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Comparison (with prepayments):                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Tenure       │  │ Interest     │  │ Total        │ │
│  │ Reduced      │  │ Saved        │  │ Savings      │ │
│  │              │  │               │  │              │ │
│  │ ↓ 84 months  │  │ ↓ ₹21,68,219 │  │ ↓ ₹21,68,219 │ │
│  │              │  │               │  │              │ │
│  │ 7 years less │  │ 40% less     │  │ 40% less     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Interactions:**
- Hover over any card: Show tooltip with breakdown
- Click card: Scroll to relevant chart
- Comparison section: Animated counters when prepayments applied
- Toggle: Show/hide comparison section

**Visual States:**
- Without prepayments: Show only top 3 cards + breakeven
- With prepayments: Show all cards with green highlights on savings
- Loading state: Skeleton placeholders

### 3.3 Interactive Amortization Table

**Table Structure:**
```
┌────────────────────────────────────────────────────────────────────────────────┐
│ Amortization Schedule                                 [Export CSV] [Print]     │
├────────────────────────────────────────────────────────────────────────────────┤
│ 🔍 Search: [_______]  Year: [All ▼]  Show: [12 ▼] rows  Prepayments: [On/Off] │
├──────┬────────┬────────────┬─────────┬──────────┬───────────┬──────────┬───────┤
│Month │ Date   │  Opening   │   EMI   │ Interest │ Principal │  Closing │  Int% │
│  #   │        │  Balance   │  Paid   │          │           │  Balance │       │
├──────┼────────┼────────────┼─────────┼──────────┼───────────┼──────────┼───────┤
│   1  │Jan'24  │ 50,00,000  │ 43,291  │  35,417  │   7,874   │49,92,126 │ 81.8% │
│   2  │Feb'24  │ 49,92,126  │ 43,291  │  35,361  │   7,930   │49,84,196 │ 81.7% │
│ ...  │        │            │         │          │           │          │       │
│  178 │Nov'38  │ 12,39,177  │ 43,291  │  8,777   │  34,514 ✓│12,04,663 │ 20.3% │ <- Breakeven
│ ...  │        │            │         │          │           │          │       │
│  240 │Dec'43  │    43,305  │ 43,305  │    305   │  43,000   │        0 │  0.7% │
└──────┴────────┴────────────┴─────────┴──────────┴───────────┴──────────┴───────┘
│ Showing 1-12 of 240 | [< Previous] [1] [2] [3] ... [20] [Next >]              │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Row Interactions:**

**1. Hover State:**
```
On hover, row highlights with light blue background + action buttons appear:

┌──────┬────────┬────────────┬─────────┬──────────┬───────────┬──────────┬───────┬────────────┐
│  36  │Dec'26  │ 46,88,234  │ 43,291  │  33,224  │  10,067   │46,78,167 │ 76.7% │ [+ Extra]  │
│      │        │            │         │          │           │          │       │ [+ Lumpsum]│
│      │        │            │         │          │           │          │       │ [⚠️ Missed]│
└──────┴────────┴────────────┴─────────┴──────────┴───────────┴──────────┴───────┴────────────┘
```

**2. Click Actions:**
- Click row: Expand to show detailed breakdown
- Click "Add Extra Payment": Open inline form
- Click "Add Lumpsum": Open modal
- Click "Mark Missed": Open confirmation dialog

**3. Drag Selection:**
```
User clicks month 12 and drags to month 24:
→ All rows 12-24 highlight in blue
→ Bulk action panel appears above table

┌────────────────────────────────────────────────────────────┐
│ 13 months selected | Add ₹ [______] extra per month       │
│ [Reduce Tenure ▼] [Apply] [Cancel]                        │
└────────────────────────────────────────────────────────────┘
```

**4. Right-Click Context Menu:**
```
┌──────────────────────────────┐
│ Month 36 Options             │
├──────────────────────────────┤
│ ➕ Add Extra Payment         │
│ 💰 Add Lumpsum Payment       │
│ ⚠️  Mark as Missed Payment   │
│ 📊 View Month Details        │
│ 📋 Copy Month Data           │
└──────────────────────────────┘
```

**Visual Indicators:**
- **Breakeven Row:** Green left border + checkmark in principal column
- **Prepayment Month:** Blue left border + badge showing amount
- **Missed Payment:** Red left border + warning icon
- **Current Month:** Bold text + highlighted background (if tracking live loan)

**Responsive Mobile View (Card Layout):**
```
┌───────────────────────────────────┐
│ Month 1 - January 2024            │
├───────────────────────────────────┤
│ Opening Balance:    ₹50,00,000    │
│ EMI Paid:           ₹43,291       │
│ Interest (81.8%):   ₹35,417       │
│ Principal (18.2%):  ₹7,874        │
│ Closing Balance:    ₹49,92,126    │
│                                   │
│ [Add Prepayment] [View Details]   │
└───────────────────────────────────┘
```

### 3.4 Prepayment Configuration Panel

**Design:**
```
┌─────────────────────────────────────────────────────────┐
│ Prepayment Strategies                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Add New:                                                │
│ ┌──────────────┐ ┌───────────────┐ ┌────────────────┐ │
│ │+ Periodic    │ │+ Lumpsum      │ │+ Missed        │ │
│ │  Extra       │ │  Payment      │ │  Payment       │ │
│ └──────────────┘ └───────────────┘ └────────────────┘ │
│                                                          │
│ Current Prepayments:                                    │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 1. Periodic Extra Payment            [Edit] [×]  │   │
│ │    Months 1-60 | ₹10,000/month                   │   │
│ │    Strategy: Reduce Tenure                       │   │
│ │    └─ Impact: ~3 years saved, ~₹8L interest ↓   │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 2. Lumpsum Payment                   [Edit] [×]  │   │
│ │    Month 36 | ₹2,00,000                          │   │
│ │    Strategy: Reduce Tenure                       │   │
│ │    └─ Impact: ~2 years saved, ~₹6.5L interest ↓ │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ [+ Add Another Prepayment]                              │
│                                                          │
│ Total Extra Payments: ₹8,00,000                         │
│ Estimated Savings: ₹21,68,219                           │
│                                                          │
│ [Calculate Impact] [Clear All]                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Add Periodic Extra Modal:**
```
┌─────────────────────────────────────────┐
│ Add Periodic Extra Payment          [×] │
├─────────────────────────────────────────┤
│                                          │
│ From Month *                             │
│ ┌─────────────────────────────────────┐ │
│ │ 1 (Jan 2024)                     ▼  │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ To Month *                               │
│ ┌─────────────────────────────────────┐ │
│ │ 60 (Dec 2028)                    ▼  │ │
│ └─────────────────────────────────────┘ │
│ Duration: 60 months (5 years)            │
│                                          │
│ Extra Amount per Month *                 │
│ ┌─────────────────────────────────────┐ │
│ │ ₹ 10,000                            │ │
│ └─────────────────────────────────────┘ │
│ Total Extra: ₹6,00,000                   │
│                                          │
│ Impact Strategy *                        │
│ ○ Reduce Tenure (Pay off loan faster)   │
│ ● Reduce EMI (Lower monthly payments)   │
│                                          │
│ Expected Impact:                         │
│ • Tenure: 240 → 205 months (-35)        │
│ • Interest Saved: ~₹8,00,000             │
│                                          │
│        [Cancel] [Add Prepayment]         │
│                                          │
└─────────────────────────────────────────┘
```

### 3.5 Charts

**Chart 1: EMI Component Breakdown (Stacked Area Chart)**

```
Visual:
₹
50K │                                      
    │                                      ████ Interest
40K │                              ████████████████████
    │                      ████████████████████████████
30K │              ████████████████████████████████████
    │      ████████████████████████████████████████████
20K │  ████████████████████████████████████████████████ ▓▓▓▓ Principal
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
10K │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  0 └─────────────────────────────────────────────────► Month
    1         60        120       178      240
                                  ↑
                              Breakeven

Hover Interaction:
┌──────────────────────┐
│ Month 36 (Dec 2026)  │
├──────────────────────┤
│ EMI: ₹43,291         │
│ Interest: ₹33,224    │
│ Principal: ₹10,067   │
│ Interest %: 76.7%    │
└──────────────────────┘
```

**Chart 2: Outstanding Principal Over Time**

```
₹
50L │●                                    Original
    │ ●●●                                 ─ ─ ─ ─ 
40L │    ●●●                              
    │       ●●●━━━━━━━━━●●●●●●●●         Modified
30L │          ━━━━━━━━━━━━━━●●●●●●●     ━━━━━━━
    │                            ━━━━━━●●
20L │                                  ━━━━━●●
    │                                        ━━━●●
10L │                                            ━━●●
    │                                               ━━━●
  0 └──────────────────────────────────────────────────► Month
    0         60        120       180      240
              ↓                           ↓
         Prepayments                 Loan closes
         start                       84 months early
```

**Chart 3: Before vs After Comparison (Grouped Bar)**

```
                  Original    With Prepayments

Total Interest   ▓▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓
                 ₹53.9L       ₹32.2L
                                      ↓ ₹21.7L saved

Tenure (months)  ▓▓▓▓▓▓▓▓▓▓   ▓▓▓▓▓▓
                 240          156
                                      ↓ 84 months

Breakeven Month  ▓▓▓▓▓▓▓▓     ▓▓▓▓
                 178          112
                                      ↓ 66 months earlier
```

---

## 4. User Flows

### 4.1 Basic EMI Calculation Flow

```
1. User lands on calculator page
   ↓
2. Sees empty loan input form
   ↓
3. Fills in Principal, Interest, Tenure
   ↓
4. Clicks "Calculate EMI"
   ↓
5. Form validates → Success
   ↓
6. Metrics dashboard animates in
   ↓
7. Charts render with transitions
   ↓
8. Amortization table loads (paginated)
   ↓
9. User can scroll, explore data
```

### 4.2 Adding Prepayment via Table (Visual Method)

```
1. User hovers over Month 36 row
   ↓
2. Row highlights + action buttons appear
   ↓
3. User clicks "+ Lumpsum" button
   ↓
4. Modal opens with prepayment form
   ↓
5. User enters ₹2,00,000
   ↓
6. Selects "Reduce Tenure"
   ↓
7. Preview shows: "Saves ~2 years, ₹6.5L interest"
   ↓
8. User clicks "Add Prepayment"
   ↓
9. Modal closes
   ↓
10. Row 36 shows blue indicator with "₹2L"
    ↓
11. Recalculation happens in background
    ↓
12. Comparison metrics update
    ↓
13. Charts update to show new schedule
```

### 4.3 Drag-Select Bulk Prepayment Flow

```
1. User clicks on Month 12 row
   ↓
2. Holds mouse, drags to Month 60
   ↓
3. Rows 12-60 highlight in blue
   ↓
4. Bulk action panel appears:
   "49 months selected"
   ↓
5. User enters ₹10,000 in "extra per month" field
   ↓
6. Selects "Reduce Tenure" strategy
   ↓
7. Live preview: "Total extra: ₹4.9L, Saves 3 years"
   ↓
8. User clicks "Apply"
   ↓
9. Selection clears
   ↓
10. Rows 12-60 now show small badge "₹10K extra"
    ↓
11. Schedule recalculates
    ↓
12. Comparison updates
```

### 4.4 Export Flow

```
1. User clicks "Export" button in header
   ↓
2. Dropdown menu appears:
   - Export as PDF
   - Export as Excel
   - Export as CSV
   - Export Charts
   ↓
3. User selects "Export as PDF"
   ↓
4. Loading spinner: "Generating PDF..."
   ↓
5. PDF generates (client-side)
   ↓
6. Download initiates
   ↓
7. Success toast: "Report downloaded successfully"
```

---

## 5. Interactive States

### 5.1 Form States

**Empty State:**
- Show placeholder values
- Helper text visible
- Calculate button disabled

**Filling State:**
- Real-time validation
- Format currency/percentages as user types
- Show min/max hints

**Valid State:**
- Green checkmarks
- Calculate button enabled and pulsing
- Preview hint: "Ready to calculate"

**Invalid State:**
- Red borders
- Error messages below fields
- Calculate button disabled

**Calculating State:**
- Loading spinner on button
- Form fields disabled
- "Calculating..." text

**Calculated State:**
- Success animation
- Show results below
- "Recalculate" button available

### 5.2 Table States

**Loading State:**
- Skeleton rows with shimmer animation
- 12 placeholder rows

**Empty State:**
- "No data yet. Calculate your loan first!"
- Illustration or icon
- CTA: "Go to Loan Form"

**Loaded State:**
- Full interactive table
- Pagination controls active
- Search/filter enabled

**Filtered State:**
- Show filter chips above table
- "X results found"
- Clear filter option

**Error State:**
- Error message
- "Try again" button
- Contact support link

### 5.3 Prepayment States

**No Prepayments:**
- Empty state illustration
- "Add your first prepayment to see savings"
- Highlight action buttons

**Single Prepayment:**
- Show prepayment card
- Impact preview visible
- Encourage more: "Add another prepayment?"

**Multiple Prepayments:**
- List view with reorder capability
- Total impact summary
- "Optimize" suggestion (future feature)

**Conflicting Prepayments:**
- Warning message
- Highlight conflicts
- Suggest resolution

---

## 6. Accessibility Specifications

### 6.1 Keyboard Navigation

```
Tab Order:
1. Loan input fields (Principal → Interest → Tenure → Start Date)
2. Calculate button
3. Metrics cards (focusable for screen readers)
4. Chart controls (next/previous, zoom)
5. Table search/filter
6. Table rows (↑↓ arrows to navigate)
7. Pagination controls
8. Prepayment action buttons
9. Export button

Shortcuts:
- Cmd/Ctrl + Enter: Calculate
- Cmd/Ctrl + S: Save scenario
- Cmd/Ctrl + E: Export
- Esc: Close modals
- ?: Open help/shortcuts dialog
```

### 6.2 Screen Reader Support

**ARIA Labels:**
```html
<input 
  aria-label="Principal loan amount in rupees"
  aria-describedby="principal-help"
  aria-invalid="false"
/>

<table aria-label="Loan amortization schedule">
  <caption>Monthly payment breakdown over 240 months</caption>
  ...
</table>

<button 
  aria-label="Add lumpsum payment for month 36"
  aria-haspopup="dialog"
>
  + Lumpsum
</button>
```

**Live Regions:**
```html
<div aria-live="polite" aria-atomic="true">
  EMI calculated: ₹43,291 per month
</div>

<div aria-live="assertive" role="alert">
  Error: Principal must be at least ₹1,00,000
</div>
```

### 6.3 Visual Accessibility

**Focus Indicators:**
- 2px solid blue outline
- 4px offset from element
- High contrast (4.5:1 minimum)

**Color Blindness:**
- Don't rely on color alone
- Use icons + text labels
- Pattern fills in charts
- High contrast mode support

**Font Scaling:**
- Support up to 200% zoom
- Responsive typography
- No horizontal scroll at 200%

---

## 7. Loading & Error States

### 7.1 Progressive Loading

```
Step 1: Instant
└─ Form renders immediately

Step 2: < 100ms
└─ Calculate EMI and basic metrics

Step 3: < 500ms
└─ Generate amortization table (first 12 rows)

Step 4: < 1s
└─ Render charts

Step 5: Background
└─ Load remaining table rows
```

### 7.2 Error Messages

**User-Friendly Errors:**

```
Instead of: "Invalid input"
Use: "Principal amount must be between ₹1,00,000 and ₹10,00,00,000"

Instead of: "Calculation failed"
Use: "We couldn't calculate your EMI. Please check your inputs and try again."

Instead of: "Network error"
Use: "Connection lost. Your data is saved locally and will sync when you're back online."
```

### 7.3 Offline Mode

**Offline Indicator:**
```
┌────────────────────────────────────┐
│ ⚠️ You're offline                  │
│ Calculations work, but saving      │
│ to cloud is paused.                │
│ [Dismiss]                          │
└────────────────────────────────────┘
```

**Offline Capabilities:**
- ✅ All calculations
- ✅ Chart rendering
- ✅ Local storage save
- ✅ Export to PDF/Excel
- ❌ Cloud sync
- ❌ Cross-device access

---

## 8. Animation & Transitions

### 8.1 Micro-interactions

**Number Animations:**
```typescript
// Counting animation for metrics
from: 0
to: 43291
duration: 800ms
easing: easeOutQuart
```

**Chart Transitions:**
```
Entry: Fade in + slide up (500ms)
Update: Morph between states (300ms)
Hover: Scale up 1.05 (200ms)
```

**Table Interactions:**
```
Row hover: Background transition (150ms)
Drag select: Selection highlight (100ms)
Prepayment badge: Bounce in (300ms)
```

### 8.2 Page Transitions

```
Route change: Fade (200ms)
Modal open: Scale + fade (250ms)
Modal close: Scale down + fade (200ms)
Toast notification: Slide in from top (300ms)
```

---

## 9. Mobile-Specific Considerations

### 9.1 Touch Interactions

**Gestures:**
- Swipe left/right: Navigate table pages
- Pull down: Refresh data
- Long press: Show context menu (table rows)
- Pinch zoom: Zoom charts
- Two-finger drag: Pan charts

### 9.2 Mobile Optimizations

**Table:**
- Switch to card view < 768px
- Swipeable cards
- Bottom sheet for actions

**Charts:**
- Simplified legend
- Larger touch targets
- Horizontal scroll if needed

**Forms:**
- Native number keyboards
- Date pickers (iOS/Android native)
- Full-screen modals on mobile

**Prepayments:**
- Bottom sheet instead of modals
- Larger action buttons (48px min height)
- Thumb-zone optimization

---

**End of UI/UX Specifications Document**
