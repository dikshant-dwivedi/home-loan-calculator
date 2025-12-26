# Home Loan Calculator - Frontend

Next.js 14 frontend application for the Home Loan Prepayment Calculator.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui
- **State Management:** Zustand 5
- **Forms:** React Hook Form 7 + Zod 4
- **Charts:** Recharts 3
- **Calculations:** decimal.js 10

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── calculator/        # Loan calculator components (future)
│   ├── charts/            # Chart components (future)
│   └── comparison/        # Comparison view components (future)
├── lib/
│   ├── calculations/      # Calculation engine (future)
│   ├── services/          # API client and services
│   ├── hooks/             # Custom React hooks (future)
│   └── utils.ts           # Utility functions (cn helper)
├── store/
│   └── loanStore.ts       # Zustand state management
└── types/
    └── index.ts           # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 20.x
- pnpm 10.x

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Next Steps

This is a scaffold-only setup. Future sessions will implement:
1. Loan input form with validation
2. EMI calculation and amortization table
3. Interactive prepayment configuration
4. Charts and visualizations
5. Scenario comparison
6. Export functionality (PDF, CSV, Excel)
