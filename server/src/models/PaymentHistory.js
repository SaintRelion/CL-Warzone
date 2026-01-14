const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  description: {
    type: String,
    trim: true
  },
  method: {
    type: String,
    enum: ['Cash', 'GCash', 'Maya', 'Bank Transfer', 'Credit Card', 'Debit Card'],
    required: [true, 'Payment method is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  amountReceived: {
    type: Number,
    min: 0
  },
  change: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Paid', 'Not Yet Paid', 'Pending', 'Failed', 'Refunded'],
    default: 'Not Yet Paid'
  },
  invoice: {
    type: String,
    trim: true
  },
  transactionRef: {
    type: String,
    trim: true
  },
  transactionScreenshot: {
    type: String, // URL or base64
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  datePaid: {
    type: Date
  },
  nextDueDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Generate invoice number before saving
paymentHistorySchema.pre('save', async function(next) {
  if (!this.invoice) {
    const count = await mongoose.model('PaymentHistory').countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    this.invoice = `INV-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Populate user details on find
paymentHistorySchema.pre(/^find/, function(next) {
  this.populate('userId', 'firstName lastName emailAddress phoneNumber');
  next();
});

module.exports = mongoose.model('PaymentHistory', paymentHistorySchema);
