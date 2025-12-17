# SMTP helper server

This small Express server exposes a single endpoint to send email using Nodemailer.

Environment variables (create a `.env` file in `server/`):

- `SMTP_HOST` - SMTP host (required)
- `SMTP_PORT` - SMTP port (optional)
- `SMTP_SECURE` - 'true' if using TLS (optional)
- `SMTP_USER` - SMTP username (optional)
- `SMTP_PASS` - SMTP password (optional)
- `SMTP_FROM` - default From address (optional)

Install and run:

```bash
cd server
pnpm install # or npm install
pnpm start   # or npm start
```

The server listens on port `3001` by default and exposes `POST /api/send-email`.
