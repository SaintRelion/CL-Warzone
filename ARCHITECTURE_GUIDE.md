# Admin Reporting Module - Visual Architecture Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  src/pages/admin/reporting/AdminReportingPage.tsx                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Report Page State                          │ │
│  │  - month, year, statusFilter, report, isLoading            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                       │
│           ┌───────────────┼───────────────┐                      │
│           ▼               ▼               ▼                      │
│                                                                   │
│  ReportControls    ReportSummary    ReportTable                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Filters      │  │ Statistics   │  │ Data Table   │           │
│  │ [Month]      │  │ 4 Cards      │  │ Search       │           │
│  │ [Year]       │  │ 4 Badges     │  │ Sort         │           │
│  │ [Status]     │  │              │  │ Pagination   │           │
│  │ [Generate]   │  │              │  │              │           │
│  │ [Export CSV] │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│           │               │               │                      │
│           └───────────────┼───────────────┘                      │
│                           ▼                                       │
│                    API Calls via Fetch                           │
│                           │                                       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  server/src/routes/reports.js                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Middleware Stack                          │ │
│  │  [protect] → [restrictTo('admin')] → [route handlers]     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                       │
│           ┌───────────────┼───────────────┐                      │
│           ▼               ▼               ▼                      │
│                                                                   │
│  GET /monthly-report  GET /export     GET /summary              │
│  ┌────────────────┐   ┌────────────┐   ┌─────────────┐          │
│  │ Generate       │   │ Export CSV │   │ List        │          │
│  │ Calculate      │   │ Format     │   │ Available   │          │
│  │ Statistics     │   │ Download   │   │ Months      │          │
│  │ JSON Response  │   │            │   │             │          │
│  └────────────────┘   └────────────┘   └─────────────┘          │
│           │               │               │                      │
│           └───────────────┼───────────────┘                      │
│                           ▼                                       │
│              Firestore Database Queries                          │
│                           │                                       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Firestore SDK
                            │
┌─────────────────────────────────────────────────────────────────┐
│                   FIRESTORE DATABASE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Collections Used:                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Users        │  │ Billing      │  │ PaymentHistory           │
│  │ - role       │  │ - userId     │  │ - userId     │           │
│  │ - firstName  │  │ - amount     │  │ - amount     │           │
│  │ - lastName   │  │ - createdAt  │  │ - status     │           │
│  │ - email      │  │ - status     │  │ - createdAt  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User navigates to /admin/reports
        │
        ▼
AdminReportingPage renders
  - Empty state shown
        │
        ▼
User selects Month/Year/Status
        │
        ▼
User clicks "Generate"
        │
        ▼
generateReport() function:
  1. Build query params
  2. Fetch /api/reports/monthly-payment-report
  3. Show loading state
        │
        ▼
Backend receives request:
  1. Verify admin role
  2. Validate month/year
  3. Query Firestore collections
  4. Aggregate data
  5. Calculate statistics
        │
        ▼
Response sent to frontend:
  - MonthlyPaymentReport object
        │
        ▼
Frontend updates state:
  - setReport(data)
  - setIsLoading(false)
        │
        ▼
Components re-render:
  - ReportSummary displays stats
  - ReportTable displays items
        │
        ▼
User can now:
  - Search table
  - Sort columns
  - Paginate
  - Export to CSV
  - Log activity
```

## Component Hierarchy

```
AdminReportingPage
├── ReportControls
│   ├── Select (Month)
│   ├── Select (Year)
│   ├── Select (Status)
│   ├── Button (Generate)
│   └── Button (Export CSV)
│
├── ReportSummary
│   ├── StatCard (Total Billable)
│   ├── StatCard (Total Collected)
│   ├── StatCard (Total Pending)
│   ├── StatCard (Collection Rate)
│   ├── Card (Paid Count)
│   ├── Card (Partially Paid Count)
│   ├── Card (Unpaid Count)
│   └── Card (Total Count)
│
└── ReportTable
    ├── SearchBox
    ├── SortDropdown
    ├── Table
    │   ├── TableHeader
    │   │   └── TableRow
    │   │       └── TableHead × 7 columns
    │   │
    │   └── TableBody
    │       └── TableRow × N items
    │           └── TableCell × 7 columns
    │
    └── Pagination
        ├── PrevButton
        ├── PageInfo
        └── NextButton
```

## State Management Flow

```
AdminReportingPage (State Management)
│
├── month: number
│   └── Updated by: ReportControls onMonthChange
│
├── year: number
│   └── Updated by: ReportControls onYearChange
│
├── statusFilter: string
│   └── Updated by: ReportControls onStatusChange
│
├── report: MonthlyPaymentReport | null
│   └── Updated by: generateReport() → setReport()
│
├── isLoading: boolean
│   └── Updated by: setIsLoading() during fetch
│
└── Callbacks
    ├── generateReport()
    │   └── Fetches /api/reports/monthly-payment-report
    │       └── Updates report state
    │
    └── exportCSV()
        └── Fetches /api/reports/monthly-payment-report/export
            └── Triggers browser download
```

## API Request/Response Flow

### Generate Report Request
```
GET /api/reports/monthly-payment-report?month=0&year=2026&status=all
Authorization: Bearer {jwt_token}

Headers:
  - Content-Type: application/json
  - Authorization: Bearer {token}

Response (200 OK):
{
  "ok": true,
  "data": {
    "month": 0,
    "year": 2026,
    "generatedAt": "2026-01-27T10:30:00Z",
    "totalBillable": "5000.00",
    "totalCollected": "4500.00",
    "totalPending": "500.00",
    "items": [ {...}, {...} ],
    "summary": {
      "totalSubscribers": 10,
      "paidSubscribers": 9,
      "partiallyPaidSubscribers": 1,
      "unpaidSubscribers": 0,
      "collectionRate": 90
    }
  }
}

Error Response (401):
{
  "error": "Not authorized to access this route"
}

Error Response (403):
{
  "error": "You do not have permission to perform this action"
}
```

### Export CSV Request
```
GET /api/reports/monthly-payment-report/export?month=0&year=2026
Authorization: Bearer {jwt_token}

Response Headers:
  - Content-Type: text/csv
  - Content-Disposition: attachment; filename="payment-report-2026-01.csv"

Response Body:
  Name,Email,Phone,Billing Amount,Paid Amount,Status,Payment Method,Transaction Ref
  "John Doe","john@example.com","09123456789","500.00","500.00","Paid","Cash","TXN123"
  ...
```

## Database Query Flow

```
Backend Handler
│
├── Query 1: Get all users with role = 'client'
│   └── Firestore: db.collection('User').where('role', '==', 'client').get()
│
├── Query 2: Get billings for month/year
│   └── Firestore: db.collection('Billing')
│       .where('createdAt', '>=', startDate)
│       .where('createdAt', '<=', endDate)
│       .get()
│
├── Query 3: Get payments for month/year
│   └── Firestore: db.collection('PaymentHistory')
│       .where('createdAt', '>=', startDate)
│       .where('createdAt', '<=', endDate)
│       .get()
│
└── Data Aggregation:
    ├── Loop through each user
    │   ├── Find user's billing record
    │   ├── Find user's payment records
    │   ├── Calculate totals
    │   ├── Determine status
    │   └── Build report item
    │
    ├── Calculate summary statistics
    │   ├── Sum all billable amounts
    │   ├── Sum all paid amounts
    │   ├── Count by status
    │   └── Calculate collection rate
    │
    └── Return aggregated report
```

## Error Handling Flow

```
Request arrives at API
│
├── Check: Is user authenticated?
│   └── No? → Return 401 "Not authorized"
│
├── Check: Is user admin?
│   └── No? → Return 403 "No permission"
│
├── Check: Valid month/year?
│   └── No? → Return 400 "Invalid month or year"
│
├── Try: Query Firestore
│   └── Error? → Return 500 "Server error"
│
├── Try: Aggregate data
│   └── Error? → Return 500 "Server error"
│
└── Success → Return 200 with data
```

## User Interaction Flow

```
┌─ Admin User -┐
│              │
│  Open        │
│  Browser     │
│     │        │
│     ▼        │
│  /admin/     │
│  reports     │
│     │        │
│     ▼        │
│  Page        │
│  Loads       │
│     │        │
│     ▼        │
│  Select      │
│  Month &     │
│  Year        │
│     │        │
│     ▼        │
│  Click       │
│  "Generate" │
│     │        │
│     ▼        │
│  Loading     │
│  Spinner     │
│     │        │
│     ▼        │
│  Report      │
│  Displays    │
│     │        │
│     ├──────────────────────┐
│     │                      │
│     ▼                      ▼
│  View Data            Click Options
│  ├─ Summary           ├─ Search
│  ├─ Table             ├─ Sort
│  └─ Stats             ├─ Filter
│                       ├─ Export CSV
│                       └─ Share
│
└──────────────┘
```

## File Dependencies

```
AdminReportingPage.tsx
├── imports Report types
├── imports ReportControls
├── imports ReportSummary
├── imports ReportTable
├── imports useActivityLogger
├── imports toast (notifications)
└── makes API calls to /api/reports/

ReportControls.tsx
├── imports Button
├── imports Select
└── receives props & callbacks

ReportSummary.tsx
├── imports MonthlyPaymentReport type
└── receives report prop

ReportTable.tsx
├── imports custom Table components
├── imports MonthlyPaymentReportItem type
└── manages internal state

Backend: reports.js
├── imports FirestoreService
├── imports middleware (protect, restrictTo)
├── imports errorHandler
└── queries Firestore collections
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Secure admin-only access
- ✅ Efficient data retrieval
- ✅ Responsive user interface
- ✅ Comprehensive error handling
- ✅ Activity logging and audit trail
