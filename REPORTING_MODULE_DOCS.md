# Admin Reporting Module Documentation

## Overview

The Admin Reporting Module is a comprehensive payment reporting system that allows administrators to generate detailed monthly payment reports showing payment status for all subscribers.

## Features

### 1. **Monthly Payment Report Generation**
- Generate reports for any month and year
- View all subscriber billing and payment information
- Filter by payment status (Paid, Partially Paid, Not Yet Paid, or All)
- Real-time calculation of payment statistics

### 2. **Report Summary Statistics**
- **Total Billable**: Sum of all billing amounts for the month
- **Total Collected**: Sum of all paid amounts
- **Total Pending**: Outstanding payments
- **Collection Rate**: Percentage of bills collected
- **Subscriber Breakdown**: Count of paid, partially paid, and unpaid subscribers

### 3. **Interactive Report Table**
- Search subscribers by name or email
- Sort by subscriber name, amount, or status
- Pagination (10 items per page)
- Visual status indicators (color-coded badges)
- View payment method and transaction references

### 4. **CSV Export**
- Export reports as CSV files
- Includes all subscriber and payment details
- Automatic file naming with month/year

### 5. **Activity Logging**
- All report generations are logged
- All CSV exports are tracked
- Activity history available in Activity Logs section

## Backend Implementation

### API Endpoints

#### GET `/api/reports/monthly-payment-report`
Generates a monthly payment report.

**Query Parameters:**
```
month: number (0-11) - Required
year: number - Required
status: string - Optional (all|Paid|Partially Paid|Not Yet Paid)
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "month": 0,
    "year": 2026,
    "generatedAt": "2026-01-27T10:30:00Z",
    "totalBillable": "5000.00",
    "totalCollected": "4500.00",
    "totalPending": "500.00",
    "items": [
      {
        "userId": "user123",
        "firstName": "John",
        "lastName": "Doe",
        "emailAddress": "john@example.com",
        "phoneNumber": "09123456789",
        "billingAmount": "500.00",
        "paidAmount": "500.00",
        "status": "Paid",
        "planId": "plan123",
        "paymentDate": "2026-01-15T08:00:00Z",
        "paymentMethod": "Cash",
        "transactionRef": "TXN123"
      }
    ],
    "summary": {
      "totalSubscribers": 10,
      "paidSubscribers": 9,
      "partiallyPaidSubscribers": 1,
      "unpaidSubscribers": 0,
      "collectionRate": 90
    }
  }
}
```

#### GET `/api/reports/monthly-payment-report/export`
Exports the monthly payment report as CSV.

**Query Parameters:**
```
month: number (0-11) - Required
year: number - Required
```

**Response:** CSV file download

#### GET `/api/reports/summary`
Gets reporting summary information (available months, current month/year).

**Response:**
```json
{
  "ok": true,
  "data": {
    "availableMonths": [
      { "year": 2026, "month": 0 },
      { "year": 2025, "month": 11 }
    ],
    "currentMonth": 0,
    "currentYear": 2026
  }
}
```

## Frontend Implementation

### Components

#### ReportControls
Provides filter controls and action buttons.
- Month/Year selection
- Payment status filter
- Generate Report button
- Export CSV button

#### ReportSummary
Displays key statistics and metrics.
- Total billable and collected amounts
- Collection rate
- Subscriber count breakdown

#### ReportTable
Interactive table showing report items.
- Searchable by name/email
- Sortable columns
- Color-coded status badges
- Pagination

#### AdminReportingPage
Main page component combining all components and managing report logic.

## Models & Types

### MonthlyPaymentReportItem
```typescript
interface MonthlyPaymentReportItem {
  userId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  billingAmount: string;
  paidAmount: string;
  status: "Paid" | "Partially Paid" | "Not Yet Paid";
  planId: string;
  paymentDate?: string;
  paymentMethod?: string;
  transactionRef?: string;
}
```

### MonthlyPaymentReport
```typescript
interface MonthlyPaymentReport {
  month: number;
  year: number;
  generatedAt: string;
  totalBillable: number;
  totalCollected: number;
  totalPending: number;
  items: MonthlyPaymentReportItem[];
  summary: {
    totalSubscribers: number;
    paidSubscribers: number;
    partiallyPaidSubscribers: number;
    unpaidSubscribers: number;
    collectionRate: number;
  };
}
```

## Navigation

The Reports page is accessible via:
- **URL**: `/admin/reports`
- **Sidebar Menu**: Click "Reports" under Admin menu (Chart Bar icon)
- **Permission**: Admin role only

## Usage Guide

### Step 1: Access Reports
1. Log in as an admin
2. Click on "Reports" in the sidebar menu

### Step 2: Select Period
1. Choose month and year from dropdowns
2. (Optional) Filter by payment status

### Step 3: Generate Report
1. Click "Generate" button
2. Report will load showing:
   - Summary statistics
   - Detailed subscriber table
   - Payment information

### Step 4: Analyze & Export
1. **Search**: Use search box to find specific subscribers
2. **Sort**: Click sort dropdown to organize data
3. **Export**: Click "Export CSV" to download report

## Security

- ✅ Admin role required for all reporting endpoints
- ✅ User authentication required (Bearer token)
- ✅ All report accesses are logged in Activity Logs
- ✅ No sensitive data exposure (passwords, keys, etc.)

## Performance Considerations

- Reports handle collections of any size efficiently
- Pagination limits table to 10 items per page
- CSV export processes server-side for large datasets
- Activity logging is asynchronous to avoid blocking

## Error Handling

- Missing month/year parameters return 400 error
- Invalid month/year values return 400 error
- Unauthorized access returns 401 error
- Non-admin users return 403 error
- Server errors return 500 with appropriate message

## Future Enhancements

Potential additions to the reporting module:
- Multiple report types (subscriber, plan usage, support tickets)
- Date range reports (not just monthly)
- Custom report templates
- Email scheduled reports
- Advanced filters (by plan, location, etc.)
- Data visualization (charts, graphs)
- Multi-period comparison
- Revenue forecasting

## File Structure

```
src/
├── models/Report.tsx                          # Report type definitions
├── repositories/ReportRepo.tsx                # Repository registration
├── pages/admin/reporting/
│   └── AdminReportingPage.tsx                # Main page
└── components/admin/
    ├── ReportControls.tsx                    # Filter controls
    ├── ReportSummary.tsx                     # Stats display
    └── ReportTable.tsx                       # Data table

server/src/
└── routes/reports.js                         # Backend API endpoints
```

## Support

For issues or questions about the reporting module, contact the development team or check the Activity Logs for detailed operation history.
