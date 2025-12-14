# Development Setup Guide
# Home Loan Prepayment Calculator

**Version:** 1.0  
**Last Updated:** December 2024  
**Estimated Setup Time:** 30-45 minutes

---

## 1. Prerequisites

### 1.1 Required Software

Install the following before starting:

| Software | Version | Download Link | Verification Command |
|----------|---------|---------------|---------------------|
| **Node.js** | 18.x LTS | [nodejs.org](https://nodejs.org/) | `node --version` |
| **pnpm** | 8.x+ | [pnpm.io](https://pnpm.io/) | `pnpm --version` |
| **Git** | 2.x+ | [git-scm.com](https://git-scm.com/) | `git --version` |
| **Docker** | 24.x+ | [docker.com](https://www.docker.com/) | `docker --version` |
| **PostgreSQL** | 15.x | [postgresql.org](https://www.postgresql.org/) | `psql --version` |

**Optional (but recommended):**
- **VS Code** - Code editor ([code.visualstudio.com](https://code.visualstudio.com/))
- **Postman** - API testing ([postman.com](https://www.postman.com/))
- **TablePlus/pgAdmin** - Database GUI ([tableplus.com](https://tableplus.com/))

### 1.2 VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-azuretools.vscode-docker",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### 1.3 System Requirements

- **OS:** macOS, Windows 10+, or Linux
- **RAM:** 8GB minimum, 16GB recommended
- **Disk Space:** 5GB free space
- **Internet:** Required for initial setup

---

## 2. Project Structure

```
loan-calculator/
├── frontend/                 # Next.js application
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and services
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript types
│   ├── public/              # Static assets
│   ├── package.json
│   └── next.config.js
│
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── loan/            # Loan calculation module
│   │   ├── scenarios/       # Scenario management module
│   │   ├── health/          # Health check module
│   │   ├── common/          # Shared utilities
│   │   └── main.ts          # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Migration files
│   ├── test/                # Tests
│   ├── package.json
│   └── nest-cli.json
│
├── docker-compose.yml       # Local development services
├── .github/                 # CI/CD workflows
└── docs/                    # This documentation
```

---

## 3. Quick Start (5 Minutes)

### Option A: Using Docker (Recommended for Quick Start)

```bash
# 1. Clone repository
git clone https://github.com/your-username/loan-calculator.git
cd loan-calculator

# 2. Start all services with Docker Compose
docker-compose up -d

# 3. Access applications
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
# Database: localhost:5432
```

### Option B: Manual Setup (More Control)

Continue reading from Section 4 below.

---

## 4. Detailed Setup Instructions

### 4.1 Install pnpm (if not already installed)

```bash
# Using npm
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm

# Verify installation
pnpm --version
```

### 4.2 Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-username/loan-calculator.git
cd loan-calculator

# Verify structure
ls -la
```

### 4.3 Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings (see section 5.1)
nano .env  # or use your preferred editor
```

**Install PostgreSQL (if not using Docker):**

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb loan_calculator_dev
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql-15
sudo systemctl start postgresql
sudo -u postgres createdb loan_calculator_dev
```

**Windows:**
Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)

**Setup Database:**
```bash
# Run Prisma migrations
pnpm prisma migrate dev --name init

# Generate Prisma client
pnpm prisma generate

# (Optional) Seed database with sample data
pnpm prisma db seed
```

**Start Backend Server:**
```bash
# Development mode with hot reload
pnpm run start:dev

# The backend should now be running at http://localhost:3001
```

**Verify Backend:**
```bash
# Test health endpoint
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","timestamp":"2024-12-14T01:47:00.000Z","uptime":123.45}
```

### 4.4 Setup Frontend

Open a **new terminal window/tab**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your settings (see section 5.2)
nano .env.local
```

**Start Frontend Development Server:**
```bash
# Development mode with hot reload
pnpm run dev

# The frontend should now be running at http://localhost:3000
```

**Verify Frontend:**
Open browser and navigate to:
- **Home:** http://localhost:3000
- **Calculator:** http://localhost:3000/calculator

---

## 5. Environment Configuration

### 5.1 Backend Environment Variables

**File:** `backend/.env`

```bash
# Application
NODE_ENV=development
PORT=3001

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/loan_calculator_dev"

# CORS
CORS_ORIGIN="http://localhost:3000"

# JWT (for future authentication)
JWT_SECRET="your-dev-secret-key-change-this"
JWT_EXPIRATION="7d"

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug

# Redis (optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=""

# Sentry (optional - for error tracking)
SENTRY_DSN=""
```

**Important Notes:**
- Change `DATABASE_URL` if your PostgreSQL credentials differ
- Change `JWT_SECRET` to a random string
- Set `CORS_ORIGIN` to your frontend URL

### 5.2 Frontend Environment Variables

**File:** `frontend/.env.local`

```bash
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_API_TIMEOUT=30000

# Application
NEXT_PUBLIC_APP_NAME="Home Loan Calculator"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_CLOUD_SAVE=false

# Analytics (optional)
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_SENTRY_DSN=""
```

---

## 6. Database Management

### 6.1 Prisma Commands

```bash
cd backend

# Generate Prisma client (after schema changes)
pnpm prisma generate

# Create a new migration
pnpm prisma migrate dev --name description_of_change

# Apply migrations
pnpm prisma migrate deploy

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# Open Prisma Studio (database GUI)
pnpm prisma studio
# Opens at http://localhost:5555
```

### 6.2 Database Seeding

**File:** `backend/prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample loan scenario
  const scenario = await prisma.loanScenario.create({
    data: {
      name: 'Sample 50L Loan',
      principal: 5000000,
      annualInterestRate: 8.5,
      tenureMonths: 240,
      originalEMI: 43291,
      totalInterestOriginal: 5389840,
    },
  });

  console.log('Created sample scenario:', scenario);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run seed:**
```bash
pnpm prisma db seed
```

---

## 7. Running Tests

### 7.1 Backend Tests

```bash
cd backend

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov

# Run specific test file
pnpm test loan.service.spec.ts

# Run integration tests
pnpm test:e2e
```

### 7.2 Frontend Tests

```bash
cd frontend

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests (Playwright)
pnpm test:e2e

# Run E2E tests in UI mode
pnpm test:e2e:ui
```

---

## 8. Development Workflow

### 8.1 Daily Development

**Start development servers:**

**Terminal 1 - Backend:**
```bash
cd backend
pnpm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm run dev
```

**Terminal 3 - Database (if needed):**
```bash
# Open Prisma Studio
cd backend
pnpm prisma studio
```

### 8.2 Making Changes

**1. Create a new branch:**
```bash
git checkout -b feature/your-feature-name
```

**2. Make your changes**

**3. Run linter:**
```bash
# Backend
cd backend
pnpm run lint

# Frontend
cd frontend
pnpm run lint
```

**4. Format code:**
```bash
# Backend
cd backend
pnpm run format

# Frontend
cd frontend
pnpm run format
```

**5. Run tests:**
```bash
# Backend
cd backend
pnpm test

# Frontend
cd frontend
pnpm test
```

**6. Commit changes:**
```bash
git add .
git commit -m "feat: add your feature description"
```

**7. Push to GitHub:**
```bash
git push origin feature/your-feature-name
```

### 8.3 Code Quality Checks

**Pre-commit hooks (using Husky):**

**File:** `.husky/pre-commit`
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linter
pnpm lint

# Run tests
pnpm test

# Check TypeScript
pnpm type-check
```

**Install Husky:**
```bash
pnpm add -D husky
pnpm husky install
```

---

## 9. Common Development Tasks

### 9.1 Adding a New API Endpoint

```bash
cd backend

# Generate new module
nest g module loan/new-feature
nest g service loan/new-feature
nest g controller loan/new-feature

# Edit the generated files
# Add your business logic
# Update API documentation
```

### 9.2 Adding a New Frontend Component

```bash
cd frontend

# Create component file
mkdir -p components/calculator/NewComponent
touch components/calculator/NewComponent/NewComponent.tsx
touch components/calculator/NewComponent/NewComponent.test.tsx
```

**Component template:**
```typescript
// components/calculator/NewComponent/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  // Define props
}

export const NewComponent: React.FC<NewComponentProps> = (props) => {
  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

### 9.3 Adding a New Database Table

```bash
cd backend

# Edit prisma/schema.prisma
# Add your model

# Generate migration
pnpm prisma migrate dev --name add_new_table

# Generate Prisma client
pnpm prisma generate
```

### 9.4 Updating Dependencies

```bash
# Check for outdated packages
pnpm outdated

# Update specific package
pnpm update package-name

# Update all packages (careful!)
pnpm update

# Update pnpm itself
pnpm add -g pnpm
```

---

## 10. Debugging

### 10.1 Backend Debugging (VS Code)

**File:** `.vscode/launch.json`
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["run", "start:debug"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector",
      "sourceMaps": true,
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
    }
  ]
}
```

**Usage:**
1. Set breakpoints in your code
2. Press F5 or click "Run and Debug"
3. Debugger attaches to the NestJS process

### 10.2 Frontend Debugging

**Browser DevTools:**
- Open Chrome DevTools (F12)
- Use React DevTools extension
- Set breakpoints in Sources tab

**VS Code Debugging:**
```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Debug Next.js",
  "url": "http://localhost:3000",
  "webRoot": "${workspaceFolder}/frontend",
  "sourceMapPathOverrides": {
    "webpack:///./*": "${webRoot}/*"
  }
}
```

### 10.3 Database Debugging

**Check database connection:**
```bash
# From backend directory
pnpm prisma db pull

# Or use psql
psql -h localhost -U postgres -d loan_calculator_dev
```

**View logs:**
```bash
# Enable Prisma query logging in .env
DATABASE_LOGGING=true

# Backend logs will show SQL queries
```

---

## 11. Troubleshooting

### 11.1 Common Issues

**Issue: Port already in use**
```bash
# Error: Port 3000 is already in use

# Solution 1: Kill the process
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Solution 2: Change port
# In package.json, change start script:
"dev": "next dev -p 3001"
```

**Issue: Database connection failed**
```bash
# Error: Can't reach database server

# Check PostgreSQL is running
# macOS
brew services list

# Ubuntu
sudo systemctl status postgresql

# Start PostgreSQL
# macOS
brew services start postgresql@15

# Ubuntu
sudo systemctl start postgresql

# Verify connection string in .env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
```

**Issue: Prisma client not generated**
```bash
# Error: @prisma/client did not initialize yet

# Solution
cd backend
pnpm prisma generate
```

**Issue: Module not found**
```bash
# Error: Cannot find module 'X'

# Solution: Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Issue: TypeScript errors in IDE**
```bash
# VS Code not recognizing types

# Solution: Restart TypeScript server
# Press Cmd+Shift+P (macOS) or Ctrl+Shift+P (Windows)
# Type: "TypeScript: Restart TS Server"
```

### 11.2 Clearing Cache

```bash
# Clear Next.js cache
cd frontend
rm -rf .next

# Clear Node modules
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Prisma cache
cd backend
rm -rf node_modules/.prisma
pnpm prisma generate
```

### 11.3 Getting Help

1. **Check Documentation:** Review relevant documentation files
2. **Search Issues:** Check GitHub issues for similar problems
3. **Check Logs:** Review console output for error messages
4. **Stack Overflow:** Search for specific error messages
5. **Ask for Help:** Create a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

---

## 12. Useful Commands Reference

### 12.1 Package Management

```bash
# Install package
pnpm add package-name

# Install dev dependency
pnpm add -D package-name

# Remove package
pnpm remove package-name

# List installed packages
pnpm list

# Update all packages
pnpm update
```

### 12.2 Git Commands

```bash
# Create new branch
git checkout -b feature/name

# Stage changes
git add .

# Commit changes
git commit -m "message"

# Push to remote
git push origin branch-name

# Pull latest changes
git pull origin main

# View status
git status

# View commit history
git log --oneline
```

### 12.3 Database Commands

```bash
# Prisma Studio (GUI)
pnpm prisma studio

# View database
pnpm prisma db pull

# Reset database
pnpm prisma migrate reset

# Create migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy
```

---

## 13. Next Steps

After setup is complete:

1. ✅ **Verify Everything Works:**
   - Frontend loads at http://localhost:3000
   - Backend responds at http://localhost:3001/health
   - Database connection successful

2. 📖 **Read Documentation:**
   - Review `01-PRODUCT-REQUIREMENTS.md` for features
   - Review `02-TECHNICAL-SPECIFICATION.md` for architecture
   - Review `03-CALCULATION-FORMULAS-REFERENCE.md` for math

3. 🎯 **Start Coding:**
   - Pick a feature from the PRD
   - Create a branch
   - Implement with tests
   - Submit PR

4. 🧪 **Run Tests:**
   - Write unit tests for new code
   - Ensure all tests pass
   - Check code coverage

5. 📝 **Update Documentation:**
   - Add JSDoc comments
   - Update API docs if needed
   - Update README if needed

---

## 14. Development Tips

### 14.1 Best Practices

✅ **Write tests first** (TDD approach)  
✅ **Use TypeScript strictly** (enable `strict` mode)  
✅ **Commit often** with descriptive messages  
✅ **Keep branches small** and focused  
✅ **Review your own PR** before requesting review  
✅ **Update documentation** with code changes  
✅ **Run linter** before committing  
✅ **Test on different browsers** (Chrome, Firefox, Safari)  

### 14.2 Performance Tips

- Use React DevTools Profiler for frontend performance
- Use Chrome Lighthouse for page speed analysis
- Monitor backend response times in development
- Use Prisma query logging to optimize database queries
- Lazy load components when appropriate

### 14.3 Security Tips

- Never commit `.env` files
- Use environment variables for secrets
- Validate all user inputs
- Sanitize data before database queries
- Keep dependencies updated

---

## 15. Additional Resources

### Documentation
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **NestJS:** [docs.nestjs.com](https://docs.nestjs.com/)
- **Prisma:** [prisma.io/docs](https://www.prisma.io/docs)
- **TypeScript:** [typescriptlang.org](https://www.typescriptlang.org/)

### Learning Resources
- **React:** [react.dev](https://react.dev/)
- **TypeScript:** [typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- **Testing:** [testing-library.com](https://testing-library.com/)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**🎉 Setup Complete! You're ready to start developing the Home Loan Prepayment Calculator!**

If you encounter any issues, refer to the Troubleshooting section or create an issue on GitHub.

Happy coding! 🚀
