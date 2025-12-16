# Project State - Home Loan Calculator

**Last Updated:** December 17, 2025 (2:25 AM)  
**Development Started:** December 14, 2025  
**Current Phase:** Development - Session B In Progress (Backend Setup Refinement)

---

## Major Milestones (All-Time)
- ✅ **Dec 14, 2025:** Project initiated, discovery interview complete
- ✅ **Dec 14, 2025:** 8 specification documents created
- ✅ **Dec 14, 2025:** Context preservation system established (CONTEXT-PRESERVATION-GUIDE v2.0)
- ✅ **Dec 15, 2025:** Documentation refinement complete
- ✅ **Dec 16, 2025:** Backend foundation complete (NestJS + Prisma 7 + PostgreSQL)

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

### 🔄 Current Work
**Status:** Session B complete - Backend setup clarity and documentation finished
**Session B completed:** December 17, 2025 (2:53 AM)
**Accomplishments:**
- ✅ Reorganized windsurfrules.txt into Global + Project-Specific sections
- ✅ Added CLI-first scaffolding rule (CRITICAL)
- ✅ Clarified Prisma 7 approach: keep prisma.config.ts (Prisma 7 recommended)
- ✅ Synced updated rules to .windsurfrules
- ✅ Audited backend: no logging, modules not CLI-generated, HealthCheck table temporary
- ✅ Connected both MCP servers: Prisma MCP and PostgreSQL MCP (both working)
- ✅ Fixed: Added dotenv dependency to backend for Prisma MCP compatibility
- ✅ Updated README.md with reproducible setup instructions
- ✅ Added MCP server documentation to docs/08-DEVELOPMENT-SETUP.md
- ✅ Verified backend working: all health endpoints responding correctly
**Next session:** Start implementing loan calculation logic

### Status
- ✅ Development environment set up
- ✅ Backend running locally (port 3001)
- ✅ Database connected (PostgreSQL via Docker)
- ❌ No frontend yet
- ❌ No loan calculation logic yet

---

## Next Actions

### Immediate Next Steps (Session C - Start Development)
1. Implement loan calculation logic (EMI, amortization schedule)
2. Create calculation service with NestJS CLI scaffolding
3. Add comprehensive tests for calculation functions
4. Create API endpoints for calculations

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

**Verify:**
```bash
curl http://localhost:3001/health
curl http://localhost:3001/health/db
```

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
