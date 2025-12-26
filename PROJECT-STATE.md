# Project State - Home Loan Calculator

**Last Updated:** December 27, 2025 (1:15 AM)  
**Development Started:** December 14, 2025  
**Current Phase:** Development - Session G Complete (Data Visualization)

---

## Major Milestones (All-Time)
- ✅ **Dec 14, 2025:** Project initiated, discovery interview complete
- ✅ **Dec 14, 2025:** 8 specification documents created
- ✅ **Dec 14, 2025:** Context preservation system established (CONTEXT-PRESERVATION-GUIDE v2.0)
- ✅ **Dec 15, 2025:** Documentation refinement complete
- ✅ **Dec 16, 2025:** Backend foundation complete (NestJS + Prisma 7 + PostgreSQL)
- ✅ **Dec 17, 2025:** Core loan calculation API complete (3 endpoints, 19 tests passing)
- ✅ **Dec 17, 2025:** Postman collection created for API testing
- ✅ **Dec 27, 2025:** Frontend scaffold complete (Next.js 14 + shadcn/ui + core libraries)
- ✅ **Dec 27, 2025:** First working UI complete with backend integration (loan calculator screen)
- ✅ **Dec 27, 2025:** Data visualization complete (amortization table + charts)

---

## Current Status

### What's Complete (Last 60 Entries)
- ✅ Discovery interview and requirements gathering
- ✅ Created 8 comprehensive specification documents
  - 01-PRODUCT-REQUIREMENTS.md
  - 02-TECHNICAL-SPECIFICATION.md
  - 03-CALCULATION-FORMULAS-REFERENCE.md
  - 04-UI-UX-SPECIFICATIONS.md
  - 05-API-DOCUMENTATION.md
  - 06-TESTING-STRATEGY.md
  - 07-DEPLOYMENT-INFRASTRUCTURE.md
  - 08-DEVELOPMENT-SETUP.md
- ✅ Created global context preservation guide (CONTEXT-PRESERVATION-GUIDE.md v2.0)
  - Simplified to 2 core terms only (Conversation, Work Session)
  - 4 essential templates (from 8)
  - Scientific, repeatable workflow
  - Global guide usable for any project
- ✅ Created context preservation system (PROJECT-STATE.md, DOCUMENT-CHANGES.md, .windsurfrules)
- ✅ Organized all files into clean structure
- ✅ Implemented automatic rolling window trimming system
  - Entry-based limit (60 entries max)
  - Auto-trim rules in .windsurfrules
  - Major Milestones section for all-time tracking
  - Zero maintenance overhead
- ✅ **Work Session A Complete (Dec 16, 2025):**
  - Installed nvm (0.40.3), Node.js 20.19.6, pnpm 10.25.0
  - Docker Desktop installed and running
  - Created monorepo structure with `backend/` folder
  - NestJS 11 backend with TypeScript strict mode
  - PostgreSQL 15 via Docker Compose
  - Prisma 7 initialized with migrations
  - Health endpoints working: `GET /health` and `GET /health/db`
- ✅ **Work Session B Complete (Dec 17, 2025):**
  - Reorganized project rules (Global + Project-Specific)
  - Added CLI-first scaffolding rule
  - Backend audit complete (logging, CLI scaffolding, temp tables identified)
  - MCP servers configured and working (Prisma + PostgreSQL)
  - Added dotenv dependency for Prisma MCP
  - Updated README.md with reproducible setup steps
  - Added MCP documentation to development guide
  - Verified backend end-to-end (all endpoints working)
  - Fixed .gitignore to exclude TypeScript build cache files
- ✅ **Work Session C Complete (Dec 17, 2025):**
  - Generated loan module with NestJS CLI (loan.module.ts, loan.service.ts, loan.controller.ts)
  - Installed decimal.js, class-validator, class-transformer
  - Created DTOs with validation (calculate-loan, calculate-with-prepayments, what-if)
  - Created interfaces for calculation results
  - Implemented EMI calculation using reducing balance method
  - Implemented amortization schedule generation
  - Implemented prepayment logic (periodic extra, lumpsum, missed payment)
  - Implemented what-if scenario calculations
  - Added global validation pipe and API prefix (/api/v1)
  - All 3 loan endpoints working:
    - POST /api/v1/loan/calculate
    - POST /api/v1/loan/calculate-with-prepayments
    - POST /api/v1/loan/what-if
  - 19 unit tests passing
- ✅ **Work Session D Complete (Dec 17, 2025):**
  - Created Postman collection (v2.1) with all 6 endpoints
  - Created local environment file with baseUrl variable
  - Added test scripts for each request (status codes, JSON structure)
  - Multiple request examples for POST endpoints (10 total requests)
  - Collection-level documentation with setup and happy path workflow
  - Files: postman/home-loan-calculator-backend.postman_collection.json
  - Files: postman/local.postman_environment.json
- ✅ **Work Session E Complete (Dec 27, 2025):**
  - Created frontend/ folder using create-next-app CLI
  - Next.js 14.2.35 with App Router, TypeScript 5, Tailwind CSS 3.4
  - Initialized shadcn/ui with Neutral color scheme
  - Added Button component (verified working)
  - Installed core libraries: zustand 5.0.9, react-hook-form 7.69.0, zod 4.2.1, @hookform/resolvers 5.2.2, recharts 3.6.0, decimal.js 10.6.0
  - Created folder structure: components/, lib/, store/, types/
  - Created TypeScript type definitions (LoanParameters, AmortizationRow, PrepaymentAction, etc.)
  - Created Zustand store with persist middleware (loanStore.ts)
  - Created API client placeholder (lib/services/api.ts)
  - Added .env.local.example with NEXT_PUBLIC_API_BASE_URL
  - Updated frontend/README.md with project-specific content
  - Verified dev server runs successfully on port 3000
- ✅ **Work Session F Complete (Dec 27, 2025):**
  - Created utility functions: formatting.ts (Indian currency, percentages), validation.ts (Zod schemas)
  - Implemented client-side EMI calculation engine using decimal.js (emi.ts)
  - Created LoanForm component with React Hook Form + Zod validation
  - Created ResultsSummary component with key metrics display
  - Updated main page (page.tsx) with full calculator UI
  - Implemented dual calculation mode: local (client-side) + API (backend)
  - Added API client with calculateLoan method
  - Created .env.local with NEXT_PUBLIC_API_BASE_URL
  - Verified end-to-end connectivity: frontend ↔ backend working
  - Frontend dev server running on port 3000
  - Backend API responding correctly on port 3001
- ✅ **Work Session G Complete (Dec 27, 2025):**
  - Created AmortizationTable component with pagination (12/24/60/120 rows per page)
  - Added search and year filter functionality to table
  - Implemented CSV export for amortization schedule
  - Breakeven month highlighting in table (green border + checkmark)
  - Created PaymentBreakdownChart (pie chart) showing principal vs interest split
  - Created BalanceOverTimeChart (line graph) showing loan balance over time
  - Integrated all components into main page with responsive 2-column grid
  - Updated type definitions: AmortizationScheduleRow interface
  - Fixed TypeScript strict mode compliance across all components
  - Production build successful (Next.js 14.2.35)
  - All components responsive and mobile-friendly

### 🔄 Current Work
**Status:** Session G complete - Data visualization experience
**Session G completed:** December 27, 2025 (1:15 AM)
**Accomplishments:**
- ✅ AmortizationTable component (pagination, search, filter, CSV export)
- ✅ PaymentBreakdownChart (pie chart with Recharts)
- ✅ BalanceOverTimeChart (line graph with Recharts)
- ✅ Responsive layout with 2-column chart grid
- ✅ TypeScript strict mode compliance
- ✅ Production build successful
- ✅ All components integrated and working
**Next session:** Add prepayment configuration panel or scenario comparison

### Status
- ✅ Development environment set up
- ✅ Backend running locally (port 3001)
- ✅ Database connected (PostgreSQL via Docker)
- ✅ Loan calculation API complete (3 endpoints)
- ✅ Unit tests for calculations (19 passing)
- ✅ Postman collection for API testing
- ✅ Frontend scaffold complete (Next.js 14 on port 3000)
- ✅ Core UI libraries installed and configured
- ✅ First UI screen working (loan calculator with form + results)
- ✅ Frontend ↔ Backend connectivity verified
- ✅ Amortization table with pagination, search, and export
- ✅ Data visualization charts (pie chart + line graph)
- ❌ No prepayment configuration yet
- ❌ No scenario persistence yet (CRUD endpoints)

---

## Next Actions

### Immediate Next Steps (Session H)
**Option 1: Prepayment Configuration UI (Recommended)**
1. Create PrepaymentPanel component with add/edit/delete functionality
2. Add forms for periodic extra, lumpsum, missed payment
3. Integrate with backend calculate-with-prepayments endpoint
4. Show before/after comparison with savings metrics

**Option 2: What-If Scenarios**
1. Create WhatIfPanel component for quick scenario testing
2. Add sliders for extra monthly payment, lumpsum, rate change
3. Real-time impact preview
4. Integrate with backend what-if endpoint

**Option 3: Backend CRUD + Persistence**
1. Implement scenario management endpoints (CRUD for saved scenarios)
2. Add Prisma models for LoanScenario and PrepaymentAction
3. Create database migrations
4. Add save/load functionality to frontend

### Backend Refactors Needed (Future Session)
**Identified in Session B - defer to dedicated refactor session:**
1. **Add logging infrastructure**
   - Use NestJS built-in Logger (no new deps) OR evaluate Winston/Pino
   - Add to PrismaService (connection events)
   - Add to HealthService (health check results)
   - Add to future calculation services
2. **Regenerate modules with NestJS CLI** (CLI-first rule)
   - Current: health/ and prisma/ modules manually created
   - Missing: .spec.ts test files for all services/controllers
   - Action: Use `nest g` commands to regenerate with proper scaffolding
3. **Remove HealthCheck table** (temporary placeholder)
   - Currently unused (health endpoint uses `SELECT 1`)
   - Remove when adding real domain models (LoanScenario, PrepaymentAction)
   - Create migration: `pnpm prisma migrate dev --name remove_health_check_table`

---

## Documentation Status

### Documents to Review/Refine
- [ ] 01-PRODUCT-REQUIREMENTS.md - Product features and requirements
- [ ] 02-TECHNICAL-SPECIFICATION.md - Architecture and tech stack
- [ ] 03-CALCULATION-FORMULAS-REFERENCE.md - Mathematical formulas
- [ ] 04-UI-UX-SPECIFICATIONS.md - Design system and interactions
- [ ] 05-API-DOCUMENTATION.md - REST API specifications
- [ ] 06-TESTING-STRATEGY.md - Testing approach
- [ ] 07-DEPLOYMENT-INFRASTRUCTURE.md - Deployment guide
- [ ] 08-DEVELOPMENT-SETUP.md - Local development setup

### Refinement Notes
- None yet - starting review process

### Important Notes
- **First git commit:** This will be the initial commit establishing the project foundation
- **windsurfrules.txt workflow:** This file exists as a helper for updating .windsurfrules (Claude can't edit dotfiles directly)
  - Process: Claude updates windsurfrules.txt → User copies content to .windsurfrules
  - Keep both files in sync

---

## Recent Decisions/Changes (Last 60 Entries)

### December 27, 2025 (Work Session G - Complete)
- **Data Visualization Strategy**
  - Built AmortizationTable component with full pagination (12/24/60/120 rows per page)
  - Added search functionality (by month number or date)
  - Year filter dropdown for quick navigation
  - CSV export functionality for full schedule
  - Breakeven month highlighting (green border + checkmark icon)
- **Chart Components (Recharts)**
  - PaymentBreakdownChart: Pie chart showing principal vs interest split
  - BalanceOverTimeChart: Line graph showing loan balance decreasing over time
  - Custom tooltips with Indian currency formatting
  - Responsive design with proper axis formatting
  - Interactive hover states and legends
- **Type Safety & TypeScript**
  - Created AmortizationScheduleRow interface for type safety
  - Fixed all TypeScript strict mode errors
  - Proper typing for Recharts tooltip and legend callbacks
  - Updated API client with proper response types
- **Layout & Integration**
  - Responsive 2-column grid for charts (stacks on mobile)
  - Vertical spacing between sections (space-y-8)
  - All components integrated into main page below ResultsSummary
  - Production build successful (Next.js 14.2.35)
- **Component Features**
  - Table: Pagination controls (First/Previous/Next/Last + page numbers)
  - Table: Color-coded columns (interest=orange, principal=green)
  - Charts: Indian currency formatting (₹XX,XX,XXX or ₹XL/XCr)
  - Charts: Tabular numbers for financial figures
  - All components mobile-responsive

### December 27, 2025 (Work Session F - Complete)
- **UI Implementation Strategy**
  - Built loan calculator page following UI/UX specs (docs/04-UI-UX-SPECIFICATIONS.md)
  - Implemented dual calculation mode: client-side (decimal.js) + backend API
  - Added automatic fallback to local calculation if API fails
  - Used React Hook Form + Zod for form validation (as per tech spec)
- **Component Architecture**
  - LoanForm: Controlled form with real-time validation, Indian currency formatting
  - ResultsSummary: Key metrics dashboard (EMI, total interest, total amount, breakeven)
  - Main page: Responsive 3-column layout (form left, results right, empty state)
- **Calculation Engine**
  - Client-side EMI calculation matches backend exactly (decimal.js precision: 20)
  - Reducing balance method implementation (Indian banking standard)
  - Amortization schedule generation (240 months)
  - Breakeven month detection (principal > interest)
- **API Integration**
  - Created apiClient.calculateLoan() method
  - Request format matches API docs exactly (POST /api/v1/loan/calculate)
  - Response parsing handles nested data structure
  - Error handling with user-friendly messages
- **Formatting & Validation**
  - Indian currency format: ₹XX,XX,XXX (formatIndianCurrency utility)
  - Validation ranges: principal (₹1L-₹10Cr), rate (0.01%-30%), tenure (6-480 months)
  - Tenure display: converts months to years + months
  - Tabular numbers for financial figures
- **End-to-End Verification**
  - ✅ Frontend dev server running on port 3000
  - ✅ Backend API responding on port 3001
  - ✅ API call successful: POST /api/v1/loan/calculate returns full schedule
  - ✅ UI renders results correctly from both local and API calculations
  - ✅ No console errors, TypeScript compilation clean

### December 27, 2025 (Work Session E - Complete)
- **Frontend Scaffold Strategy**
  - Used official create-next-app CLI (CLI-first rule compliance)
  - Command: `pnpm create next-app@14 frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
  - Chose Next.js 14.2.35 (not latest 15.x) for stability with React 18
  - Selected Neutral color scheme for shadcn/ui (professional, clean)
- **Library Versions**
  - zustand 5.0.9 (latest, with persist middleware)
  - react-hook-form 7.69.0 (latest stable)
  - zod 4.2.1 (latest, breaking changes from v3)
  - recharts 3.6.0 (latest, React 18 compatible)
  - decimal.js 10.6.0 (for precise financial calculations)
- **Project Structure**
  - Followed technical specification folder layout
  - Created placeholder directories for future components
  - Zustand store with localStorage persistence enabled
  - API client uses NEXT_PUBLIC_API_BASE_URL env var (defaults to localhost:3001)
- **Verification**
  - Dev server runs successfully on port 3000
  - Tailwind CSS confirmed working (blue box visible)
  - shadcn/ui Button component renders with variants
  - TypeScript compilation successful

### December 17, 2025 (Work Session D - Complete)
- **Postman Collection Created**
  - Collection format: Postman v2.1
  - Uses {{baseUrl}} variable (default: http://localhost:3001)
  - Organized by folders: App, Health, Loan
  - 10 request examples covering all endpoint variants
  - Test scripts assert 2xx status and JSON structure
  - Collection-level docs with setup instructions

### December 17, 2025 (Work Session C - Complete)
- **Loan Calculation Implementation**
  - Used decimal.js for precise financial calculations (20 decimal precision)
  - EMI formula: reducing balance method (Indian banking standard)
  - Amortization schedule includes breakeven month detection
  - Prepayment types: periodic_extra, lumpsum, missed_payment
  - Impact strategies: reduce_tenure, reduce_emi
  - What-if scenarios: extra_monthly, lumpsum, rate_change
- **API Design**
  - Global prefix: /api/v1
  - Global validation pipe with whitelist and transform
  - Response format matches API documentation spec
  - EMI = ₹43,391 for standard test case (₹50L, 8.5%, 20yr)

### December 17, 2025 (Work Session B - Complete)
- **CLI-First Scaffolding Policy (CRITICAL)**
  - Added global rule: always check for official CLI/schematics before creating files
  - Applies to: NestJS, Next.js, Prisma, Docker, all major tools
  - Prefer CLI-generated baseline + minimal custom changes
  - Stay aligned with current recommended docs (avoid outdated patterns)
- **Windsurf Rules Reorganization**
  - Split windsurfrules.txt into two parts:
    - PART 1: GLOBAL RULES (reusable across all projects)
    - PART 2: PROJECT-SPECIFIC RULES (home loan calculator only)
  - Makes it easy to bootstrap new projects with global rules
  - Synced to .windsurfrules
- **Prisma 7 Configuration Approach**
  - Confirmed: prisma.config.ts is Prisma 7 official recommendation
  - Decision: Keep it (not "custom", it's the new scaffold style)
  - Uses env('DATABASE_URL') pattern from Prisma docs
  - Runtime uses PrismaPg adapter for Prisma 7 + NestJS integration

### December 16, 2025 (Work Session A)
- **Backend Foundation Setup**
  - Chose Node.js 20 LTS over 18 (better performance, future-proof)
  - Prisma 7 (latest) has breaking changes vs Prisma 5 in docs
  - Used adapter pattern (`PrismaPg`) for Prisma 7 + NestJS
  - Monorepo structure: `backend/` folder at project root
  - Ports: backend 3001, PostgreSQL 5432

### December 15, 2025 (PM Session)
- **Context Preservation Strategy Finalized**
  - Problem identified: Files could grow to 400+ lines, causing token bloat and discovery issues
  - Evaluated 3 approaches: phase-based archiving, rolling window, git-first
  - **Decision: Rolling window with automatic AI trimming**
  - Implementation:
    - Entry-based limit (60 entries = ~40 completions + ~20 decisions)
    - Auto-trim rules in .windsurfrules (AI checks and trims automatically)
    - Major Milestones section for all-time high-level tracking
    - Git history as long-term archive
  - **Result:** Zero overhead, optimal token cost, no discovery problem
  - Updated: .windsurfrules, PROJECT-STATE.md structure, CONTEXT-PRESERVATION-GUIDE.md

### December 15, 2025 (AM Session)
- **GitHub MCP Server Decision**
  - Evaluated GitHub MCP server for context preservation
  - Decision: Don't add now - current workflow sufficient
  - Revisit at: 50+ commits OR second developer OR GitHub Issues usage

### December 14, 2025
- Created 8 specification documents
- Established context preservation system
- Simplified guide: 2 core terms only (Conversation, Work Session)
- Removed rigid implementation plan for flexible workflow
- Deleted 09-IMPLEMENTATION-STRATEGY-WITH-CLAUDE.md

---

## Questions/Blockers

### Open Questions
- None currently

### Blockers
- None currently

---

## Notes for Next Session

**Backend is running. To restart:**
```bash
# Start PostgreSQL
docker compose up -d

# Start backend (from project root)
cd backend && pnpm run start:dev
```

**Frontend is ready. To start:**
```bash
# From project root
cd frontend && pnpm dev
```

**Verify health:**
```bash
curl http://localhost:3001/api/v1/health
curl http://localhost:3001/api/v1/health/db
```

**Test loan calculation:**
```bash
curl -X POST http://localhost:3001/api/v1/loan/calculate \
  -H "Content-Type: application/json" \
  -d '{"principal": 5000000, "annualInterestRate": 8.5, "tenureMonths": 240}'
```

**Frontend URLs:**
- Dev server: http://localhost:3000
- Current page: Test page showing Tailwind + shadcn/ui working

---

## How to Update This File

**After each work session (2 minutes):**
1. Update "Last Updated" date
2. Add completed items to "What's Complete"
3. Update "Current Work" and "Current File State"
4. Add decisions to "Recent Decisions/Changes"
5. Update "Next Actions"

**AI will automatically trim if total entries exceed 60** (no action needed from you).

---

## For Deep Historical Context

**When you need old decisions/features:**
```bash
# Search git history
git log --grep="[feature/keyword]"

# See PROJECT-STATE.md at specific commit
git show [commit-hash]:PROJECT-STATE.md

# Feature file history
git log --oneline -- [filepath]
```
