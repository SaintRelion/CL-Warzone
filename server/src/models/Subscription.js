const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: [true, 'Plan ID is required']
  },
  balance: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    required: [true, 'Service address is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Inactive', 'Pending'],
    default: 'Pending'
  },
  nextBillingDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
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

// Populate user and plan details on find
subscriptionSchema.pre(/^find/, function(next) {
  this.populate('userId', 'firstName lastName emailAddress phoneNumber')
      .populate('planId', 'name speed price');
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
