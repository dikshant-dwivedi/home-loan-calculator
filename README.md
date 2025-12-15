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
│   │   └── health/                     # Health check endpoints
│   ├── prisma/
│   │   └── schema.prisma               # Database schema
│   ├── prisma.config.ts                # Prisma 7 configuration
│   └── .env                            # Environment variables (not in git)
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

**Phase:** Development - Backend Foundation Complete  
**Backend running** with health endpoints working.

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

```bash
# Start PostgreSQL
docker compose up -d

# Start backend
cd backend && pnpm run start:dev

# Verify (in another terminal)
curl http://localhost:3001/health      # {"ok":true}
curl http://localhost:3001/health/db   # {"db":"ok"}
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

## 🎯 What's Next

1. **Commit** current work (backend foundation) ✅
2. **Next session (B):** Refine backend setup
   - Improve README and setup instructions
   - Review backend structure and patterns
   - Q&A about Prisma 7, NestJS, etc.
3. **Future:** Add loan calculation logic, then frontend
