# CL-Warzone Backend API

A comprehensive REST API backend for the CL-Warzone ISP Management System built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication**: JWT-based authentication with role-based access control
- 👥 **User Management**: Full CRUD operations for users (admin/client roles)
- 📋 **Subscription Management**: Manage customer subscriptions and plans
- 💰 **Billing & Payments**: Process payments, generate invoices, track payment history
- 🎫 **Support Tickets**: Customer support ticket system with responses
- 🔧 **Installations**: Schedule and track service installations
- 📊 **Dashboard**: Comprehensive admin dashboard with analytics
- 📧 **Email**: Send emails and payment receipts via SMTP
- 📝 **Activity Logs**: Track all system activities

## Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x (local or MongoDB Atlas)
- npm or pnpm

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/warzone
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# SMTP (optional - for email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- Admin user: `admin@warzone.com` / `admin123`
- Sample clients with subscriptions, payments, and tickets

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/update-password` | Update password | Private |
| PUT | `/api/auth/update-profile` | Update profile | Private |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Private |
| POST | `/api/users` | Create user | Admin |
| PUT | `/api/users/:id` | Update user | Private |
| DELETE | `/api/users/:id` | Deactivate user | Admin |

### Plans
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/plans` | Get all plans | Public |
| GET | `/api/plans/:id` | Get plan by ID | Public |
| POST | `/api/plans` | Create plan | Admin |
| PUT | `/api/plans/:id` | Update plan | Admin |
| DELETE | `/api/plans/:id` | Deactivate plan | Admin |

### Subscriptions
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/subscriptions` | Get subscriptions | Private |
| GET | `/api/subscriptions/:id` | Get subscription by ID | Private |
| GET | `/api/subscriptions/stats/summary` | Get statistics | Admin |
| POST | `/api/subscriptions` | Create subscription | Private |
| PUT | `/api/subscriptions/:id` | Update subscription | Admin |
| PUT | `/api/subscriptions/:id/status` | Update status | Admin |
| DELETE | `/api/subscriptions/:id` | Cancel subscription | Admin |

### Payments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/payments` | Get payments | Private |
| GET | `/api/payments/:id` | Get payment by ID | Private |
| GET | `/api/payments/stats/summary` | Get statistics | Admin |
| GET | `/api/payments/user/:userId` | Get user's payments | Private |
| POST | `/api/payments` | Create payment | Admin |
| PUT | `/api/payments/:id` | Update payment | Admin |
| POST | `/api/payments/:id/process` | Process payment (cashier) | Admin |
| DELETE | `/api/payments/:id` | Delete payment | Admin |

### Support Tickets
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tickets` | Get tickets | Private |
| GET | `/api/tickets/:id` | Get ticket by ID | Private |
| GET | `/api/tickets/stats/summary` | Get statistics | Admin |
| POST | `/api/tickets` | Create ticket | Private |
| PUT | `/api/tickets/:id` | Update ticket | Private |
| POST | `/api/tickets/:id/respond` | Add response | Private |
| PUT | `/api/tickets/:id/status` | Update status | Admin |
| DELETE | `/api/tickets/:id` | Delete ticket | Admin |

### Installations
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/installations` | Get installations | Private |
| GET | `/api/installations/:id` | Get installation by ID | Private |
| GET | `/api/installations/stats/summary` | Get statistics | Admin |
| POST | `/api/installations` | Schedule installation | Private |
| PUT | `/api/installations/:id` | Update installation | Private |
| PUT | `/api/installations/:id/status` | Update status | Admin |
| DELETE | `/api/installations/:id` | Cancel installation | Private |

### Dashboard (Admin)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Get all dashboard stats | Admin |
| GET | `/api/dashboard/revenue-chart` | Get revenue chart data | Admin |
| GET | `/api/dashboard/subscription-breakdown` | Get subscription breakdown | Admin |

### Activity Logs (Admin)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/activity-logs` | Get all activity logs | Admin |
| GET | `/api/activity-logs/stats/summary` | Get statistics | Admin |
| GET | `/api/activity-logs/user/:userId` | Get user's logs | Admin |
| DELETE | `/api/activity-logs/clear` | Clear old logs | Admin |

### Email
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/email/send` | Send email | Admin |
| POST | `/api/email/send-receipt` | Send payment receipt | Admin |
| POST | `/api/email/contact` | Contact form | Public |

## Request/Response Examples

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@warzone.com",
  "password": "admin123"
}
```

Response:
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "...",
    "firstName": "Admin",
    "lastName": "User",
    "emailAddress": "admin@warzone.com",
    "role": "admin"
  }
}
```

### Authenticated Request
```bash
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1...
```

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Project Structure

```
server/
├── src/
│   ├── index.js              # Entry point
│   ├── seed.js               # Database seeding script
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   ├── errorHandler.js   # Error handling middleware
│   │   └── activityLog.js    # Activity logging middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Plan.js
│   │   ├── Subscription.js
│   │   ├── PaymentHistory.js
│   │   ├── SupportTicket.js
│   │   ├── Installation.js
│   │   └── ActivityLog.js
│   └── routes/
│       ├── auth.js
│       ├── users.js
│       ├── plans.js
│       ├── subscriptions.js
│       ├── payments.js
│       ├── tickets.js
│       ├── installations.js
│       ├── email.js
│       ├── dashboard.js
│       └── activityLogs.js
├── .env.example
├── package.json
└── README.md
```

## License

MIT

The server listens on port `3001` by default and exposes `POST /api/send-email`.
