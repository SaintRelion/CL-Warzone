# Quick Start: Admin Reporting Module

## 🚀 Getting Started

The Admin Reporting Module is now ready to use. Here's how to get started:

## Step 1: Verify Installation

Make sure all files are in place:

```
✅ server/src/routes/reports.js          - Backend API routes
✅ src/models/Report.tsx                 - Type definitions
✅ src/pages/admin/reporting/AdminReportingPage.tsx    - Main page
✅ src/components/admin/ReportControls.tsx             - Filter controls
✅ src/components/admin/ReportSummary.tsx              - Stats display
✅ src/components/admin/ReportTable.tsx                - Data table
✅ src/repositories/ReportRepo.tsx       - Data repository
```

## Step 2: Access the Feature

1. Start your application:
   ```bash
   # Terminal 1 - Frontend
   pnpm dev
   
   # Terminal 2 - Backend
   cd server
   npm run dev
   ```

2. Log in as an admin user

3. Click **"Reports"** in the admin sidebar (Chart Bar icon)

## Step 3: Generate Your First Report

1. **Select a Month and Year**
   - Use the dropdown menus at the top
   - Default: Current month and year

2. **Optional: Filter by Status**
   - All (default)
   - Paid
   - Partially Paid
   - Not Yet Paid

3. **Click "Generate"**
   - Report loads in 1-2 seconds
   - Summary statistics display at top
   - Detailed table shows below

## Step 4: Analyze the Data

### View Summary
- **Total Billable**: Sum of all bills for the month
- **Total Collected**: Sum of all payments received
- **Total Pending**: Outstanding amount
- **Collection Rate**: Percentage of bills paid

### Explore the Table
- **Search**: Find subscribers by name or email
- **Sort**: Click sort dropdown to organize by Name, Amount, or Status
- **Paginate**: Navigate through results (10 per page)
- **Status Badges**: Color-coded payment status
  - 🟢 Green = Paid
  - 🟡 Yellow = Partially Paid
  - 🔴 Red = Not Yet Paid

## Step 5: Export to CSV

1. Click **"Export CSV"** button
2. File downloads automatically: `payment-report-YYYY-MM.csv`
3. Open in Excel, Google Sheets, or your preferred tool

## 📊 Report Components

```
┌─────────────────────────────────────────────┐
│        PAYMENT REPORTS HEADER               │
├─────────────────────────────────────────────┤
│                                              │
│  FILTERS                                    │
│  [Month ▼] [Year ▼] [Status ▼]            │
│  [Generate] [Export CSV]                    │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  SUMMARY STATS                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Total    │ │ Total    │ │ Total    │   │
│  │ Billable │ │ Collected│ │ Pending  │   │
│  │ ₱X,XXX   │ │ ₱X,XXX   │ │ ₱X,XXX   │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                              │
│  SUBSCRIBER BREAKDOWN                       │
│  Paid: 9  Partially Paid: 1  Unpaid: 0    │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  DETAILED TABLE                             │
│  Name  │ Email │ Amount │ Paid │ Status    │
│  ──────┼───────┼────────┼──────┼──────────│
│  John  │ ...   │ ₱500   │ ₱500 │ ✓ Paid   │
│  Jane  │ ...   │ ₱750   │ ₱500 │ ⚠ Partial│
│  ──────┴───────┴────────┴──────┴──────────│
│                                              │
│  Showing 1-2 of 10 [< 1 >]                │
│                                              │
└─────────────────────────────────────────────┘
```

## 🔧 Troubleshooting

### Report won't generate
- ✅ Make sure you're logged in as an admin
- ✅ Check browser console for errors (F12 → Console)
- ✅ Verify month is 0-11 and year is valid
- ✅ Check backend is running on port 3001

### Export CSV not working
- ✅ Allow browser to download files
- ✅ Check your download folder
- ✅ Make sure 'month' and 'year' are selected

### Can't see "Reports" menu
- ✅ You must be logged in as admin
- ✅ Admin sidebar only shows for admin users
- ✅ Check your user role in the database

### Data seems wrong
- ✅ Verify billing records exist for that month
- ✅ Check payment records have correct dates
- ✅ Ensure user billing amounts are set

## 📈 Common Use Cases

### Monthly Collection Review
1. Go to Reports
2. Select last month
3. View collection rate
4. Identify unpaid subscribers
5. Export CSV for follow-up

### Reconciliation
1. Generate report
2. Compare with your accounting records
3. Verify totals match
4. Use CSV for detailed comparison

### Management Reports
1. Generate current month report
2. Take screenshot of summary stats
3. Share with leadership
4. Export CSV for documentation

### Follow-up Collections
1. Generate report for current month
2. Filter by "Not Yet Paid"
3. Note subscriber names and amounts
4. Contact subscribers for payment

## 💡 Tips & Tricks

- **Quick Comparison**: Generate same month, different year to see trends
- **Large Exports**: CSV exports handle any number of subscribers
- **Mobile Friendly**: Report works on phones and tablets
- **Search Fast**: Type name or email to instantly filter
- **Activity Trail**: Check Activity Logs to see who generated what reports

## 🔐 Permissions

✅ **Admin Only**: This feature is restricted to admin users only

To test as admin:
1. Use an admin account to log in
2. Admin accounts have role = "admin" in database
3. Contact system administrator if you need admin access

## 📞 Support

For issues or questions:
1. Check `REPORTING_MODULE_DOCS.md` for detailed documentation
2. Check `IMPLEMENTATION_SUMMARY.md` for technical details
3. Review Activity Logs for operation history
4. Contact development team

---

**Reporting Module Status**: ✅ READY TO USE

Happy Reporting! 📊
