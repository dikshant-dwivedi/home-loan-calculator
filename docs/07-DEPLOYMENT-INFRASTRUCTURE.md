# Deployment & Infrastructure Guide
# Home Loan Prepayment Calculator

**Version:** 1.0  
**Last Updated:** December 2024

---

## 1. Architecture Overview

### 1.1 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CDN (Cloudflare / CloudFront)            │
│                    Static Assets & Edge Caching              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│                    Deployed on Vercel / Netlify              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Static Pages (SSG)                                   │  │
│  │ - Home, About, Docs                                  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Dynamic Pages (SSR/ISR)                              │  │
│  │ - Calculator (CSR for interactivity)                 │  │
│  │ - Scenarios List                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS/API
┌─────────────────────────────────────────────────────────────┐
│              Load Balancer (AWS ALB / Nginx)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴──────────────┐
                ▼                            ▼
┌───────────────────────────┐  ┌───────────────────────────┐
│  Backend Server 1         │  │  Backend Server 2         │
│  (NestJS on Node.js)      │  │  (NestJS on Node.js)      │
│  Docker Container         │  │  Docker Container         │
└───────────────────────────┘  └───────────────────────────┘
                │                            │
                └─────────────┬──────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│                    (AWS RDS / Managed)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Primary Instance                                     │  │
│  │ Read Replicas (optional)                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack Summary

**Frontend:**
- Platform: Vercel (recommended) or Netlify
- Framework: Next.js 14+ (App Router)
- Node Version: 18.x LTS

**Backend:**
- Platform: AWS ECS / Google Cloud Run / Railway
- Framework: NestJS 10.x
- Node Version: 18.x LTS
- Runtime: Docker container

**Database:**
- Service: AWS RDS PostgreSQL / Supabase / Railway
- Version: PostgreSQL 15.x
- Backup: Automated daily backups

**CDN & Storage:**
- CDN: Cloudflare / AWS CloudFront
- Object Storage: AWS S3 (for exports, backups)

**Monitoring:**
- Application: Sentry, LogRocket
- Infrastructure: AWS CloudWatch / Datadog
- Uptime: UptimeRobot

---

## 2. Environment Configuration

### 2.1 Frontend Environment Variables

**File:** `.env.local` (development)
```bash
# Application
NEXT_PUBLIC_APP_NAME="Home Loan Calculator"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_API_TIMEOUT=30000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_CLOUD_SAVE=false

# Analytics (optional)
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_SENTRY_DSN=""

# Environment
NODE_ENV=development
```

**File:** `.env.production`
```bash
# Application
NEXT_PUBLIC_APP_NAME="Home Loan Calculator"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# API Configuration
NEXT_PUBLIC_API_URL="https://api.your-domain.com/api/v1"
NEXT_PUBLIC_API_TIMEOUT=30000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ENABLE_CLOUD_SAVE=true

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_SENTRY_DSN="https://xxx@sentry.io/xxx"

# Environment
NODE_ENV=production
```

### 2.2 Backend Environment Variables

**File:** `.env` (development)
```bash
# Application
NODE_ENV=development
PORT=3001
APP_NAME="Home Loan Calculator API"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/loan_calculator_dev"
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=loan_calculator_dev
DB_SYNC=true
DB_LOGGING=true

# CORS
CORS_ORIGIN="http://localhost:3000"

# Security
JWT_SECRET="your-dev-secret-key-change-in-production"
JWT_EXPIRATION="7d"

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json

# Redis (optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=""

# External Services
SENTRY_DSN=""
```

**File:** `.env.production`
```bash
# Application
NODE_ENV=production
PORT=3001
APP_NAME="Home Loan Calculator API"

# Database (use connection string from managed service)
DATABASE_URL="${MANAGED_DB_CONNECTION_STRING}"
DB_SSL=true
DB_SYNC=false
DB_LOGGING=false

# CORS
CORS_ORIGIN="https://your-domain.com"

# Security
JWT_SECRET="${SECURE_RANDOM_SECRET}"
JWT_EXPIRATION="7d"

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Redis
REDIS_HOST="${REDIS_HOST}"
REDIS_PORT=6379
REDIS_PASSWORD="${REDIS_PASSWORD}"

# External Services
SENTRY_DSN="${SENTRY_DSN}"
```

---

## 3. Docker Configuration

### 3.1 Frontend Dockerfile

**File:** `frontend/Dockerfile`
```dockerfile
# Multi-stage build for Next.js

# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 3.2 Backend Dockerfile

**File:** `backend/Dockerfile`
```dockerfile
# Multi-stage build for NestJS

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm build

# Remove dev dependencies
RUN pnpm prune --prod

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

### 3.3 Docker Compose

**File:** `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: loan-calculator-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: loan_calculator_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: loan-calculator-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: loan-calculator-api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/loan_calculator_dev
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: loan-calculator-web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001/api/v1
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
  redis_data:
```

---

## 4. CI/CD Pipeline

### 4.1 GitHub Actions - Frontend

**File:** `.github/workflows/frontend-deploy.yml`
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
          cache-dependency-path: frontend/pnpm-lock.yaml
      
      - name: Install dependencies
        working-directory: ./frontend
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        working-directory: ./frontend
        run: pnpm test
      
      - name: Build
        working-directory: ./frontend
        run: pnpm build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.PROD_API_URL }}
          NEXT_PUBLIC_GA_ID: ${{ secrets.GA_ID }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

### 4.2 GitHub Actions - Backend

**File:** `.github/workflows/backend-deploy.yml`
```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: loan-calculator-api
          IMAGE_TAG: ${{ github.sha }}
        working-directory: ./backend
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster loan-calculator-cluster \
            --service loan-calculator-api-service \
            --force-new-deployment
```

---

## 5. Cloud Platform Deployments

### 5.1 Vercel Deployment (Frontend)

**Configuration:** `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@prod-api-url",
    "NEXT_PUBLIC_GA_ID": "@ga-id"
  },
  "regions": ["bom1", "sin1"],
  "framework": "nextjs"
}
```

**Deployment Steps:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 5.2 Railway Deployment (Backend + Database)

**Configuration:** `railway.json`
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "backend/Dockerfile"
  },
  "deploy": {
    "startCommand": "node dist/main.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Deployment:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### 5.3 AWS ECS Deployment (Backend)

**Task Definition:** `ecs-task-definition.json`
```json
{
  "family": "loan-calculator-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "loan-calculator-api",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/loan-calculator-api:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT_ID:secret:DATABASE_URL"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/loan-calculator-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

---

## 6. Database Management

### 6.1 Migrations with Prisma

**Run Migrations:**
```bash
# Development
npx prisma migrate dev --name init

# Production
npx prisma migrate deploy
```

**Seed Database:**
```bash
npx prisma db seed
```

**Prisma Schema:** `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model LoanScenario {
  id                    String             @id @default(uuid())
  userId                String?
  name                  String
  principal             Decimal            @db.Decimal(12, 2)
  annualInterestRate    Decimal            @db.Decimal(5, 2)
  tenureMonths          Int
  startDate             DateTime?
  originalEMI           Decimal?           @db.Decimal(12, 2)
  modifiedEMI           Decimal?           @db.Decimal(12, 2)
  originalTenure        Int?
  modifiedTenure        Int?
  totalInterestOriginal Decimal?           @db.Decimal(12, 2)
  totalInterestModified Decimal?           @db.Decimal(12, 2)
  totalSavings          Decimal?           @db.Decimal(12, 2)
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt
  
  prepayments           PrepaymentAction[]
  
  @@index([userId])
  @@index([createdAt])
}

model PrepaymentAction {
  id                  String        @id @default(uuid())
  scenarioId          String
  type                String
  startMonth          Int?
  endMonth            Int?
  extraAmountPerMonth Decimal?      @db.Decimal(12, 2)
  paymentMonth        Int?
  lumpsumAmount       Decimal?      @db.Decimal(12, 2)
  missedMonth         Int?
  penaltyAmount       Decimal?      @db.Decimal(12, 2)
  impactStrategy      String
  createdAt           DateTime      @default(now())
  
  scenario            LoanScenario  @relation(fields: [scenarioId], references: [id], onDelete: Cascade)
  
  @@index([scenarioId])
}
```

### 6.2 Backup Strategy

**Automated Backups (AWS RDS):**
```bash
# Daily automated backups with 7-day retention
# Configured in RDS console or Terraform

# Manual backup
aws rds create-db-snapshot \
  --db-instance-identifier loan-calculator-db \
  --db-snapshot-identifier loan-calculator-backup-$(date +%Y%m%d)
```

**Export to S3:**
```bash
# Export database to S3
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > backup.sql.gz
aws s3 cp backup.sql.gz s3://loan-calculator-backups/$(date +%Y%m%d)/
```

---

## 7. Monitoring & Logging

### 7.1 Application Monitoring

**Sentry Configuration:**
```typescript
// frontend/lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});

// backend/src/main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 7.2 Logging Strategy

**Winston Logger (Backend):**
```typescript
// backend/src/logger/logger.service.ts
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});
```

### 7.3 Health Checks

**Backend Health Endpoint:**
```typescript
// backend/src/health/health.controller.ts
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected', // Check DB connection
    };
  }
}
```

---

## 8. Security Considerations

### 8.1 SSL/TLS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8.2 Environment Secrets Management

**AWS Secrets Manager:**
```bash
# Store secret
aws secretsmanager create-secret \
  --name loan-calculator/database-url \
  --secret-string "postgresql://user:pass@host:5432/db"

# Retrieve in application
const secret = await secretsManager.getSecretValue({ SecretId: 'loan-calculator/database-url' }).promise();
```

---

## 9. Scaling Strategy

### 9.1 Horizontal Scaling

**Auto-scaling (ECS):**
```json
{
  "serviceArn": "arn:aws:ecs:...",
  "scalableDimension": "ecs:service:DesiredCount",
  "minCapacity": 2,
  "maxCapacity": 10,
  "targetTrackingScaling": {
    "targetValue": 75.0,
    "predefinedMetricType": "ECSServiceAverageCPUUtilization"
  }
}
```

### 9.2 Caching Strategy

**Redis Caching:**
```typescript
// Cache calculation results
async cacheCalculation(key: string, data: any) {
  await redis.setex(key, 3600, JSON.stringify(data));
}

async getCachedCalculation(key: string) {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}
```

---

## 10. Disaster Recovery

### 10.1 Backup Retention Policy
- **Daily backups:** Retained for 7 days
- **Weekly backups:** Retained for 4 weeks
- **Monthly backups:** Retained for 12 months

### 10.2 Recovery Procedures

**Database Restoration:**
```bash
# Restore from S3 backup
aws s3 cp s3://loan-calculator-backups/20241214/backup.sql.gz .
gunzip backup.sql.gz
psql -h $DB_HOST -U $DB_USER $DB_NAME < backup.sql
```

**Point-in-Time Recovery (RDS):**
```bash
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier loan-calculator-db \
  --target-db-instance-identifier loan-calculator-db-restored \
  --restore-time 2024-12-14T00:00:00Z
```

---

**End of Deployment & Infrastructure Guide**
