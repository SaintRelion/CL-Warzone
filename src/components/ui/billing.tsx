<div class="invoice-title">
                <h2>INVOICE</h2>
                <p style="font-size: 13px; color: #666;">Invoice #: <strong>INV-2024-001234</strong></p>
                <p style="font-size: 13px; color: #666;">Date: <strong>December 15, 2024</strong></p>
                <p style="font-size: 13px; color: #666;">Due Date: <strong>January 15, 2025</strong></p>
                <div class="qr-section">
                    <div id="qrcode"></div>
                    <p>Scan for invoice details</p>
                </div>
            </div><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internet Service Invoice</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
        }
            color: #0066cc;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .company-info p {
            color: #666;
            font-size: 13px;
            line-height: 1.6;
        }
        
        .invoice-title {
            text-align: right;
        }
        
        .invoice-title h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .qr-section {
            text-align: center;
            margin-top: 15px;
        }
        
        .qr-section p {
            font-size: 11px;
            color: #999;
            margin-top: 8px;
        }
        
        #qrcode {
            display: inline-block;
            padding: 10px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .section-title {
            color: #0066cc;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        
        .detail-line {
            color: #333;
            font-size: 13px;
            line-height: 1.8;
        }
        
        .detail-line strong {
            color: #333;
        }
        
        table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: collapse;
        }
        
        thead {
            background-color: #0066cc;
            color: white;
        }
        
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 15px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        
        tbody tr:hover {
            background-color: #f9f9f9;
        }
        
        .amount {
            text-align: right;
            font-weight: 500;
            color: #333;
        }
        
        .summary {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        
        .summary-box {
            width: 350px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        
        .summary-row.subtotal {
            color: #333;
        }
        
        .summary-row.tax {
            color: #333;
        }
        
        .summary-row.total {
            background-color: #0066cc;
            color: white;
            font-weight: bold;
            font-size: 16px;
            border: none;
        }
        
        .notes {
            background-color: #f9f9f9;
            padding: 20px;
            border-left: 4px solid #0066cc;
            margin-bottom: 30px;
            font-size: 12px;
            color: #666;
        }
        
        .notes strong {
            display: block;
            color: #0066cc;
            margin-bottom: 8px;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 11px;
        }
        
        .print-button {
            text-align: right;
            margin-bottom: 20px;
        }
        
        .print-button button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
        }
        
        .print-button button:hover {
            background-color: #0052a3;
        }
        
        @media print {
            body {
                background-color: white;
                padding: 0;
            }
            .print-button {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="print-button">
            <button onclick="window.print()">🖨️ Print Invoice</button>
        </div>
        
        <div class="header">
            <div class="company-info">
                <h1>NetConnect ISP</h1>
                <p>123 Tech Avenue<br>
                   San Francisco, CA 94105<br>
                   Phone: (555) 123-4567<br>
                   Email: billing@netconnect.com</p>
            </div>
            <div class="invoice-title">
                <h2>INVOICE</h2>
                <p style="font-size: 13px; color: #666;">Invoice #: <strong>INV-2024-001234</strong></p>
                <p style="font-size: 13px; color: #666;">Date: <strong>December 15, 2024</strong></p>
                <p style="font-size: 13px; color: #666;">Due Date: <strong>January 15, 2025</strong></p>
            </div>
        </div>
        
        <div class="invoice-details">
            <div>
                <div class="section-title">Bill To:</div>
                <div class="detail-line">
                    <strong>John Anderson</strong><br>
                    456 Oak Street, Apt 201<br>
                    San Francisco, CA 94102<br>
                    Phone: (555) 987-6543<br>
                    Email: john.anderson@email.com
                </div>
            </div>
            <div>
                <div class="section-title">Account Information:</div>
                <div class="detail-line">
                    <strong>Account #:</strong> ACC-987654321<br>
                    <strong>Service Address:</strong> 456 Oak Street, Apt 201<br>
                    <strong>Billing Period:</strong> Nov 15 - Dec 15, 2024<br>
                    <strong>Service Plan:</strong> Fiber 500 Mbps
                </div>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Service Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th class="amount">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Internet Service - Fiber 500 Mbps</td>
                    <td>1 month</td>
                    <td>$79.99</td>
                    <td class="amount">$79.99</td>
                </tr>
                <tr>
                    <td>Router/Modem Rental</td>
                    <td>1 month</td>
                    <td>$10.00</td>
                    <td class="amount">$10.00</td>
                </tr>
                <tr>
                    <td>WiFi 6 Equipment Add-on</td>
                    <td>1 month</td>
                    <td>$5.00</td>
                    <td class="amount">$5.00</td>
                </tr>
                <tr>
                    <td>Modem Upgrade One-Time Fee</td>
                    <td>1</td>
                    <td>$99.99</td>
                    <td class="amount">$99.99</td>
                </tr>
            </tbody>
        </table>
        
        <div class="summary">
            <div class="summary-box">
                <div class="summary-row subtotal">
                    <span>Subtotal:</span>
                    <span>$194.98</span>
                </div>
                <div class="summary-row tax">
                    <span>Tax (8.875%):</span>
                    <span>$17.31</span>
                </div>
                <div class="summary-row total">
                    <span>TOTAL DUE:</span>
                    <span>$212.29</span>
                </div>
            </div>
        </div>
        
        <div class="notes">
            <strong>Payment Terms & Notes:</strong>
            <p>Payment is due by January 15, 2025. Late payment of 1.5% monthly interest may apply. Payment can be made online at www.netconnect.com/pay, by phone at (555) 123-4567, or by mail. For billing inquiries, contact our customer service team. Thank you for being a valued customer!</p>
        </div>
        
        <div class="footer">
            <p>NetConnect Internet Service Provider | www.netconnect.com | © 2024 All Rights Reserved</p>
            <p style="margin-top: 5px;">This is an automatically generated invoice. Please contact our support team for any discrepancies.</p>
        </div>
    </div>
    
    <script>
        // Generate QR code with invoice details
        const qrData = "Invoice: INV-2024-001234 | Account: ACC-987654321 | Amount: $212.29 | Due: January 15, 2025 | Payment: www.netconnect.com/pay";
        
        const qrcode = new QRCode(document.getElementById("qrcode"), {
            text: qrData,
            width: 150,
            height: 150,
            colorDark: "#0066cc",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    </script>
</body>
</html>