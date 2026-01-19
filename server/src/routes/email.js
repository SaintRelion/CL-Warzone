const express = require('express');
const nodemailer = require('nodemailer');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, restrictTo, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
};

// @route   POST /api/email/send
// @desc    Send email
// @access  Private/Admin
router.post('/send', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
  const { to, subject, text, html, from } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, text/html' });
  }

  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: from || process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });

  res.json({ ok: true, messageId: info.messageId });
}));

// @route   POST /api/email/send-receipt
// @desc    Send payment receipt via email
// @access  Private/Admin
router.post('/send-receipt', protect, restrictTo('admin'), asyncHandler(async (req, res) => {
  const { to, customerName, invoiceNumber, amount, paymentMethod, paymentDate, nextDueDate } = req.body;

  if (!to || !customerName || !invoiceNumber || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = createTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .amount { font-size: 28px; font-weight: bold; color: #667eea; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .details table { width: 100%; }
        .details td { padding: 10px 0; border-bottom: 1px solid #eee; }
        .details td:last-child { text-align: right; font-weight: bold; }
        .success-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Payment Receipt</h1>
          <p>CL-Warzone Internet Services</p>
        </div>
        <div class="content">
          <p>Dear <strong>${customerName}</strong>,</p>
          <p>Thank you for your payment. Here are the details of your transaction:</p>
          
          <div class="details">
            <p style="text-align: center;"><span class="success-badge">✓ Payment Successful</span></p>
            <p style="text-align: center;" class="amount">₱${amount.toLocaleString()}</p>
            <table>
              <tr>
                <td>Invoice Number</td>
                <td>${invoiceNumber}</td>
              </tr>
              <tr>
                <td>Payment Method</td>
                <td>${paymentMethod}</td>
              </tr>
              <tr>
                <td>Payment Date</td>
                <td>${new Date(paymentDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>Next Due Date</td>
                <td>${new Date(nextDueDate).toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Thank you for choosing CL-Warzone!</p>
        </div>
        <div class="footer">
          <p>CL-Warzone Internet Services</p>
          <p>support@warzone.com | (02) 123-4567</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Payment Receipt - ${invoiceNumber}`,
    html,
  });

  res.json({ ok: true, messageId: info.messageId });
}));

// @route   POST /api/email/contact
// @desc    Send contact form email (public)
// @access  Public
router.post('/contact', optionalAuth, asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, subject, message' });
  }

  const transporter = createTransporter();

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <hr>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html,
  });

  res.json({ ok: true, message: 'Message sent successfully' });
}));

module.exports = router;
