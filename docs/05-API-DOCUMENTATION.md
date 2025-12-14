# API Documentation
# Home Loan Prepayment Calculator Backend

**Version:** 1.0  
**Base URL:** `/api/v1`  
**Last Updated:** December 2024

---

## 1. Overview

### 1.1 API Architecture
- **Type:** RESTful API
- **Protocol:** HTTPS
- **Format:** JSON
- **Authentication:** Bearer Token (future), currently open
- **Rate Limiting:** 100 requests/minute per IP

### 1.2 Common Headers

**Request Headers:**
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token} (future)
```

**Response Headers:**
```http
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1639564800
```

### 1.3 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "timestamp": "2024-12-14T01:47:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Principal amount must be between 100000 and 100000000",
    "details": [
      {
        "field": "principal",
        "message": "Must be at least 100000"
      }
    ]
  },
  "timestamp": "2024-12-14T01:47:00.000Z"
}
```

---

## 2. Loan Calculation Endpoints

### 2.1 Calculate Basic EMI

**Endpoint:** `POST /api/v1/loan/calculate`

**Description:** Calculate EMI and generate amortization schedule for a loan without prepayments.

**Request Body:**
```json
{
  "principal": 5000000,
  "annualInterestRate": 8.5,
  "tenureMonths": 240,
  "startDate": "2024-01-01"
}
```

**Request Parameters:**

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| `principal` | number | Yes | 100000 - 100000000 | Loan principal in rupees |
| `annualInterestRate` | number | Yes | 0.01 - 30 | Annual interest rate in percentage |
| `tenureMonths` | number | Yes | 6 - 480 | Loan tenure in months |
| `startDate` | string | No | ISO 8601 date | Loan start date (default: today) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "loanParameters": {
      "principal": 5000000,
      "annualInterestRate": 8.5,
      "tenureMonths": 240,
      "startDate": "2024-01-01"
    },
    "calculation": {
      "emi": 43291,
      "totalInterest": 5389840,
      "totalAmount": 10389840,
      "monthlyInterestRate": 0.00708333,
      "breakevenMonth": 178
    },
    "amortizationSchedule": [
      {
        "monthNumber": 1,
        "monthYear": "Jan 2024",
        "date": "2024-01-01",
        "openingBalance": 5000000,
        "emiPaid": 43291,
        "interestComponent": 35417,
        "principalComponent": 7874,
        "extraPayment": 0,
        "totalPayment": 43291,
        "closingBalance": 4992126,
        "interestPercentage": 81.82,
        "cumulativeInterest": 35417,
        "cumulativePrincipal": 7874,
        "isBreakeven": false
      }
      // ... 239 more months
    ]
  },
  "message": "EMI calculated successfully",
  "timestamp": "2024-12-14T01:47:00.000Z"
}
```

**Error Responses:**

`400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "principal",
        "message": "Principal must be between 100000 and 100000000"
      }
    ]
  }
}
```

`500 Internal Server Error`
```json
{
  "success": false,
  "error": {
    "code": "CALCULATION_ERROR",
    "message": "Failed to calculate EMI"
  }
}
```

---

### 2.2 Calculate with Prepayments

**Endpoint:** `POST /api/v1/loan/calculate-with-prepayments`

**Description:** Calculate loan with prepayment strategies applied.

**Request Body:**
```json
{
  "loanParameters": {
    "principal": 5000000,
    "annualInterestRate": 8.5,
    "tenureMonths": 240,
    "startDate": "2024-01-01"
  },
  "prepayments": [
    {
      "type": "periodic_extra",
      "startMonth": 1,
      "endMonth": 60,
      "extraAmountPerMonth": 10000,
      "impactStrategy": "reduce_tenure"
    },
    {
      "type": "lumpsum",
      "paymentMonth": 36,
      "lumpsumAmount": 200000,
      "impactStrategy": "reduce_tenure"
    }
  ]
}
```

**Prepayment Types:**

**Type 1: Periodic Extra Payment**
```json
{
  "type": "periodic_extra",
  "startMonth": 1,
  "endMonth": 60,
  "extraAmountPerMonth": 10000,
  "impactStrategy": "reduce_tenure" // or "reduce_emi"
}
```

**Type 2: Lumpsum Payment**
```json
{
  "type": "lumpsum",
  "paymentMonth": 36,
  "lumpsumAmount": 200000,
  "impactStrategy": "reduce_tenure" // or "reduce_emi"
}
```

**Type 3: Missed Payment**
```json
{
  "type": "missed_payment",
  "missedMonth": 18,
  "penaltyAmount": 5000
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "original": {
      "emi": 43291,
      "totalInterest": 5389840,
      "totalAmount": 10389840,
      "tenure": 240,
      "breakevenMonth": 178
    },
    "modified": {
      "emi": 43291,
      "totalInterest": 3245621,
      "totalAmount": 8845621,
      "tenure": 156,
      "breakevenMonth": 112,
      "finalEMI": 43291
    },
    "comparison": {
      "tenureReduced": 84,
      "tenureReducedYears": 7,
      "interestSaved": 2168219,
      "totalSavings": 2168219,
      "totalExtraPaid": 800000,
      "savingsPercentage": 40.24,
      "roi": 271.03,
      "breakevenShift": -66
    },
    "prepaymentSummary": [
      {
        "type": "periodic_extra",
        "startMonth": 1,
        "endMonth": 60,
        "totalAmount": 600000,
        "impact": {
          "tenureReduced": 48,
          "interestSaved": 1200000
        }
      },
      {
        "type": "lumpsum",
        "paymentMonth": 36,
        "totalAmount": 200000,
        "impact": {
          "tenureReduced": 36,
          "interestSaved": 968219
        }
      }
    ],
    "modifiedSchedule": [
      // Full amortization schedule with prepayments applied
    ]
  },
  "message": "Loan calculated with prepayments successfully"
}
```

---

### 2.3 What-If Quick Calculator

**Endpoint:** `POST /api/v1/loan/what-if`

**Description:** Quick calculation for what-if scenarios without persisting.

**Request Body:**
```json
{
  "currentScenario": {
    "principal": 5000000,
    "annualInterestRate": 8.5,
    "tenureMonths": 240,
    "currentMonth": 12,
    "outstandingBalance": 4892126
  },
  "whatIf": {
    "type": "extra_monthly",
    "amount": 5000,
    "fromMonth": 13,
    "toMonth": 240
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "impact": {
      "monthsSaved": 42,
      "interestSaved": 876543,
      "newTenure": 198,
      "newEMI": 43291
    },
    "recommendation": "Adding ₹5,000 extra per month will save you 3.5 years and ₹8.77 lakhs in interest"
  }
}
```

---

## 3. Scenario Management Endpoints

### 3.1 Create Scenario

**Endpoint:** `POST /api/v1/scenarios`

**Description:** Save a loan scenario for future reference.

**Request Body:**
```json
{
  "name": "My Home Loan - Conservative Strategy",
  "description": "5K extra monthly for first 5 years",
  "loanParameters": {
    "principal": 5000000,
    "annualInterestRate": 8.5,
    "tenureMonths": 240,
    "startDate": "2024-01-01"
  },
  "prepayments": [
    {
      "type": "periodic_extra",
      "startMonth": 1,
      "endMonth": 60,
      "extraAmountPerMonth": 5000,
      "impactStrategy": "reduce_tenure"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My Home Loan - Conservative Strategy",
    "description": "5K extra monthly for first 5 years",
    "loanParameters": { /* ... */ },
    "prepayments": [ /* ... */ ],
    "calculatedMetrics": {
      "originalEMI": 43291,
      "modifiedEMI": 43291,
      "totalSavings": 1200000
    },
    "createdAt": "2024-12-14T01:47:00.000Z",
    "updatedAt": "2024-12-14T01:47:00.000Z"
  },
  "message": "Scenario created successfully"
}
```

---

### 3.2 List All Scenarios

**Endpoint:** `GET /api/v1/scenarios`

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `sortBy` | string | createdAt | Sort field |
| `sortOrder` | string | desc | asc or desc |
| `search` | string | - | Search in name/description |

**Example:** `GET /api/v1/scenarios?page=1&limit=10&sortBy=createdAt&sortOrder=desc`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "scenarios": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Conservative Strategy",
        "principal": 5000000,
        "tenure": 240,
        "totalSavings": 1200000,
        "tenureReduced": 35,
        "createdAt": "2024-12-14T01:47:00.000Z"
      }
      // ... more scenarios
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

---

### 3.3 Get Scenario by ID

**Endpoint:** `GET /api/v1/scenarios/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Conservative Strategy",
    "description": "...",
    "loanParameters": { /* ... */ },
    "prepayments": [ /* ... */ ],
    "calculationResult": {
      "original": { /* ... */ },
      "modified": { /* ... */ },
      "comparison": { /* ... */ },
      "modifiedSchedule": [ /* ... */ ]
    },
    "createdAt": "2024-12-14T01:47:00.000Z",
    "updatedAt": "2024-12-14T01:47:00.000Z"
  }
}
```

**Error:** `404 Not Found`
```json
{
  "success": false,
  "error": {
    "code": "SCENARIO_NOT_FOUND",
    "message": "Scenario with ID 550e8400-e29b-41d4-a716-446655440000 not found"
  }
}
```

---

### 3.4 Update Scenario

**Endpoint:** `PATCH /api/v1/scenarios/:id`

**Request Body:**
```json
{
  "name": "Updated Strategy Name",
  "prepayments": [
    // Updated prepayments array
  ]
}
```

**Response:** `200 OK`

---

### 3.5 Delete Scenario

**Endpoint:** `DELETE /api/v1/scenarios/:id`

**Response:** `204 No Content`

---

### 3.6 Compare Scenarios

**Endpoint:** `POST /api/v1/scenarios/compare`

**Description:** Compare multiple scenarios side-by-side.

**Request Body:**
```json
{
  "scenarioIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "660e8400-e29b-41d4-a716-446655440001",
    "770e8400-e29b-41d4-a716-446655440002"
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "comparison": [
      {
        "scenarioId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Conservative",
        "totalSavings": 1200000,
        "tenureReduced": 35,
        "extraPaid": 300000,
        "roi": 400
      },
      {
        "scenarioId": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Aggressive",
        "totalSavings": 2500000,
        "tenureReduced": 84,
        "extraPaid": 1000000,
        "roi": 250
      }
      // ...
    ],
    "recommendation": {
      "bestForSavings": "660e8400-e29b-41d4-a716-446655440001",
      "bestForROI": "550e8400-e29b-41d4-a716-446655440000"
    }
  }
}
```

---

## 4. Export Endpoints

### 4.1 Export Scenario as PDF

**Endpoint:** `GET /api/v1/scenarios/:id/export/pdf`

**Response:** `200 OK`
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="loan-scenario-2024-12-14.pdf"

[PDF Binary Data]
```

---

### 4.2 Export Scenario as Excel

**Endpoint:** `GET /api/v1/scenarios/:id/export/excel`

**Response:** `200 OK`
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="loan-scenario-2024-12-14.xlsx"

[Excel Binary Data]
```

---

### 4.3 Export Scenario as CSV

**Endpoint:** `GET /api/v1/scenarios/:id/export/csv`

**Query Parameters:**
- `type`: `schedule` | `prepayments` | `comparison` (default: all as zip)

**Response:** `200 OK`
```
Content-Type: text/csv
Content-Disposition: attachment; filename="amortization-schedule.csv"

[CSV Data]
```

---

## 5. Utility Endpoints

### 5.1 Validate Loan Parameters

**Endpoint:** `POST /api/v1/loan/validate`

**Request Body:**
```json
{
  "principal": 5000000,
  "annualInterestRate": 8.5,
  "tenureMonths": 240
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "valid": true,
    "warnings": [
      {
        "field": "tenureMonths",
        "message": "20 years is a long tenure. Consider shorter tenure to save interest."
      }
    ]
  }
}
```

---

### 5.2 Get Interest Rate Suggestions

**Endpoint:** `GET /api/v1/loan/interest-rates`

**Description:** Get current market interest rates for reference (future: integrate with real bank APIs).

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "marketRates": [
      {
        "bank": "SBI",
        "minRate": 8.5,
        "maxRate": 9.65,
        "lastUpdated": "2024-12-01"
      },
      {
        "bank": "HDFC",
        "minRate": 8.75,
        "maxRate": 9.5,
        "lastUpdated": "2024-12-01"
      }
    ],
    "averageRate": 8.95,
    "lowestRate": 8.5
  }
}
```

---

### 5.3 Calculate Breakeven for Prepayment

**Endpoint:** `POST /api/v1/loan/prepayment-breakeven`

**Description:** Calculate when prepayment investment breaks even.

**Request Body:**
```json
{
  "currentLoan": {
    "principal": 5000000,
    "annualInterestRate": 8.5,
    "remainingTenure": 228,
    "outstandingBalance": 4892126
  },
  "prepaymentAmount": 500000,
  "alternativeInvestmentRate": 7.5
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "prepaymentSavings": 875000,
    "alternativeInvestmentReturns": 650000,
    "netBenefit": 225000,
    "recommendation": "Prepay - saves ₹2.25L more than investing",
    "breakevenYears": 0
  }
}
```

---

## 6. Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `SCENARIO_NOT_FOUND` | 404 | Scenario ID doesn't exist |
| `CALCULATION_ERROR` | 500 | Calculation logic error |
| `EXPORT_ERROR` | 500 | Export generation failed |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INVALID_PREPAYMENT` | 400 | Prepayment configuration invalid |
| `CONFLICTING_PREPAYMENTS` | 400 | Multiple prepayments for same month |

---

## 7. Rate Limiting

```
Limits:
- 100 requests per minute per IP
- 1000 requests per hour per IP
- 10,000 requests per day per IP

Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1639564800 (Unix timestamp)

When exceeded:
HTTP 429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 45 seconds.",
    "retryAfter": 45
  }
}
```

---

## 8. Webhooks (Future)

**Event:** `scenario.calculated`
```json
{
  "event": "scenario.calculated",
  "scenarioId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "timestamp": "2024-12-14T01:47:00.000Z",
  "data": {
    "totalSavings": 1200000
  }
}
```

---

**End of API Documentation**
