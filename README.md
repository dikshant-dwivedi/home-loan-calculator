# Home Loan Calculator - Project Root

## 📁 Project Structure

```
/Users/dikshantdwivedi/development/design/
├── README.md                           # This file - project overview
├── PROJECT-STATE.md                    # ⭐ Current progress tracker (UPDATE AFTER EACH SESSION)
├── DOCUMENT-CHANGES.md                 # Track deviations from original specs
├── CONTEXT-PRESERVATION-GUIDE.md       # 📚 Global guide (use for any project)
├── .windsurfrules                      # Project rules (auto-loaded)
├── .gitignore                          # Git ignore rules
├── docker-compose.yml                  # PostgreSQL database container
├── backend/                            # NestJS backend application
│   ├── src/
│   │   ├── main.ts                     # App entry point (port 3001)
│   │   ├── prisma/                     # Prisma service module
│   │   ├── health/                     # Health check endpoints
│   │   └── loan/                       # Loan calculation endpoints
│   ├── prisma/
│   │   └── schema.prisma               # Database schema
│   ├── prisma.config.ts                # Prisma 7 configuration
│   └── .env                            # Environment variables (not in git)
├── postman/                            # API testing collection
│   ├── home-loan-calculator-backend.postman_collection.json
│   └── local.postman_environment.json
└── docs/                               # All specification documents
    ├── 00-README-INDEX.md              # Master index
    ├── 01-PRODUCT-REQUIREMENTS.md
    ├── 02-TECHNICAL-SPECIFICATION.md
    ├── 03-CALCULATION-FORMULAS-REFERENCE.md
    ├── 04-UI-UX-SPECIFICATIONS.md
    ├── 05-API-DOCUMENTATION.md
    ├── 06-TESTING-STRATEGY.md
    ├── 07-DEPLOYMENT-INFRASTRUCTURE.md
    └── 08-DEVELOPMENT-SETUP.md
```

## 🚀 Current Status

**Phase:** Development - Core Loan API Complete  
**Backend running** with loan calculation endpoints working (3 endpoints, 19 tests passing).

See `PROJECT-STATE.md` for detailed current state.

## 📝 File Responsibilities

### YOU Update (After Each Work Session):
- **PROJECT-STATE.md** - Takes 2 minutes, with Claude's help
  - Update "What's Complete" section
  - Update "Next Actions"
  - Add any decisions to "Recent Decisions/Changes"
  - Mark date

### Claude Updates (During Session):
- **DOCUMENT-CHANGES.md** - When specs are modified
- **docs/*.md** - When refining documentation

### Auto-Loaded (No Maintenance):
- **.windsurfrules** - Set once, forget about it

## 📚 Important Files

### CONTEXT-PRESERVATION-GUIDE.md
**Global guide you can use for ANY project** - explains the workflow for working with Claude across multiple sessions. Read this once, use it everywhere.

### PROJECT-STATE.md
**Project-specific tracker** - tracks YOUR progress on THIS project. Update after each work session.

### docs/ folder
**8 specification documents** for this loan calculator project.

## ⚙️ Quick Start

**Prerequisites:** Node.js 20.x, pnpm 10.x, Docker Desktop running

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Backend setup (first time only)
cd backend
pnpm install
cp .env.example .env

# 3. Database migrations
pnpm prisma migrate deploy
pnpm prisma generate

# 4. Start backend (development mode)
pnpm run start:dev

# 5. Verify (in another terminal)
curl http://localhost:3001/api/v1/health       # {"ok":true}
curl http://localhost:3001/api/v1/health/db    # {"db":"ok"}
curl http://localhost:3001/api/v1              # Hello World!
```

**Subsequent runs (after first setup):**
```bash
docker compose up -d
cd backend && pnpm run start:dev
```

## 🔄 Next Conversation Prompt

Copy this to start your next Claude conversation:

```markdown
Continuing work on home loan calculator project.

CONTEXT FILES:
@PROJECT-STATE.md - Current state (read this first)
@DOCUMENT-CHANGES.md - Any spec changes

CURRENT PHASE:
Development - Backend foundation complete

TASK:
Refine backend setup - improve docs, ask questions, ensure reproducibility

WORKING STYLE:
- Review and improve README instructions
- Ask questions about Prisma 7, NestJS patterns
- Update PROJECT-STATE.md at end of session
```

## 📖 Quick Reference

**View current state:** Open `PROJECT-STATE.md`  
**See documentation:** Open `docs/00-README-INDEX.md`  
**Track changes:** Open `DOCUMENT-CHANGES.md`  

## 📮 Postman Collection

A complete Postman collection is available for API testing:

```bash
# Import into Postman:
postman/home-loan-calculator-backend.postman_collection.json
postman/local.postman_environment.json

# Or use Newman (CLI):
npm install -g newman
newman run postman/home-loan-calculator-backend.postman_collection.json \
  -e postman/local.postman_environment.json
```

**Endpoints included:**
- `GET /api/v1/health` - Health check
- `GET /api/v1/health/db` - Database health
- `POST /api/v1/loan/calculate` - Basic EMI calculation
- `POST /api/v1/loan/calculate-with-prepayments` - Prepayment scenarios
- `POST /api/v1/loan/what-if` - What-if analysis

## 🔌 MCP Servers (Optional - Windsurf IDE)

**Configured in Session B:**
- ✅ **Prisma MCP Server** - Database migrations, schema management
- ⚠️ **PostgreSQL MCP Server** - Direct DB queries (needs troubleshooting)

**Setup:** See `docs/08-DEVELOPMENT-SETUP.md` Section 16 for configuration details.

**Dependencies Added:**
- `dotenv` package (required for Prisma MCP compatibility)

## 🎯 What's Next

1. ✅ Backend foundation complete
2. ✅ Core loan calculation API (3 endpoints)
3. ✅ Postman collection for API testing
4. **Next:** Scenario persistence (CRUD) or frontend development
