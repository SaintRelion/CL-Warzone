require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Plan = require('./models/Plan');
const Subscription = require('./models/Subscription');
const PaymentHistory = require('./models/PaymentHistory');
const SupportTicket = require('./models/SupportTicket');
const Installation = require('./models/Installation');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/warzone');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Plan.deleteMany({}),
      Subscription.deleteMany({}),
      PaymentHistory.deleteMany({}),
      SupportTicket.deleteMany({}),
      Installation.deleteMany({})
    ]);

    // Create plans
    console.log('📦 Creating plans...');
    const plans = await Plan.create([
      {
        name: 'Basic Plan',
        speed: '15 Mbps',
        price: 999,
        features: ['15 Mbps Speed', 'Unlimited Data', 'Free Installation', '24/7 Support'],
        description: 'Perfect for light internet users. Ideal for browsing and social media.'
      },
      {
        name: 'Standard Plan',
        speed: '30 Mbps',
        price: 1299,
        features: ['30 Mbps Speed', 'Unlimited Data', 'Free Installation', '24/7 Support', 'Free Router'],
        description: 'Great for families. Stream HD videos and work from home.'
      },
      {
        name: 'Premium Plan',
        speed: '50 Mbps',
        price: 1599,
        features: ['50 Mbps Speed', 'Unlimited Data', 'Free Installation', '24/7 Priority Support', 'Free Router', 'Static IP'],
        description: 'For power users. Perfect for gaming and 4K streaming.'
      },
      {
        name: 'Business Plan',
        speed: '100 Mbps',
        price: 2499,
        features: ['100 Mbps Speed', 'Unlimited Data', 'Free Installation', '24/7 Priority Support', 'Managed Router', 'Static IP', 'SLA Guarantee'],
        description: 'Enterprise-grade connectivity for businesses.'
      },
      {
        name: 'Enterprise Plan',
        speed: '200 Mbps',
        price: 4999,
        features: ['200 Mbps Speed', 'Unlimited Data', 'Free Installation', 'Dedicated Support', 'Managed Router', 'Multiple Static IPs', 'SLA Guarantee', 'Dedicated Account Manager'],
        description: 'Maximum performance for large enterprises.'
      }
    ]);
    console.log(`   Created ${plans.length} plans`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      emailAddress: 'admin@warzone.com',
      passwordHash: 'admin123',
      phoneNumber: '09171234567',
      streetAddress: '123 Admin Street',
      city: 'Manila',
      zipCode: '1000',
      serviceArea: 'Metro Manila',
      role: 'admin'
    });
    console.log(`   Created admin: ${adminUser.emailAddress}`);

    // Create sample client users
    console.log('👥 Creating sample users...');
    const clientData = [
      { firstName: 'Juan', lastName: 'dela Cruz', emailAddress: 'juan@example.com', city: 'Makati', serviceArea: 'Metro Manila' },
      { firstName: 'Maria', lastName: 'Santos', emailAddress: 'maria@example.com', city: 'Quezon City', serviceArea: 'Metro Manila' },
      { firstName: 'Pedro', lastName: 'Reyes', emailAddress: 'pedro@example.com', city: 'Pasig', serviceArea: 'Metro Manila' },
      { firstName: 'Ana', lastName: 'Garcia', emailAddress: 'ana@example.com', city: 'Taguig', serviceArea: 'Metro Manila' },
      { firstName: 'Carlos', lastName: 'Mendoza', emailAddress: 'carlos@example.com', city: 'Mandaluyong', serviceArea: 'Metro Manila' },
      { firstName: 'Lisa', lastName: 'Tan', emailAddress: 'lisa@example.com', city: 'San Juan', serviceArea: 'Metro Manila' },
      { firstName: 'Robert', lastName: 'Santos', emailAddress: 'robert@example.com', city: 'Paranaque', serviceArea: 'Metro Manila' },
      { firstName: 'Patricia', lastName: 'Flores', emailAddress: 'patricia@example.com', city: 'Las Pinas', serviceArea: 'Metro Manila' },
      { firstName: 'Michael', lastName: 'Torres', emailAddress: 'michael@example.com', city: 'Muntinlupa', serviceArea: 'Metro Manila' },
      { firstName: 'Jennifer', lastName: 'Lopez', emailAddress: 'jennifer@example.com', city: 'Cavite', serviceArea: 'Cavite' }
    ];

    const clients = await User.create(
      clientData.map(data => ({
        ...data,
        passwordHash: 'password123',
        phoneNumber: `0917${Math.floor(1000000 + Math.random() * 9000000)}`,
        streetAddress: `${Math.floor(100 + Math.random() * 900)} Sample Street`,
        zipCode: `${Math.floor(1000 + Math.random() * 9000)}`,
        role: 'client'
      }))
    );
    console.log(`   Created ${clients.length} client users`);

    // Create subscriptions
    console.log('📋 Creating subscriptions...');
    const statuses = ['Active', 'Active', 'Active', 'Active', 'Suspended', 'Active', 'Active', 'Inactive', 'Active', 'Active'];
    const subscriptions = await Subscription.create(
      clients.map((client, index) => ({
        userId: client._id,
        planId: plans[index % plans.length]._id,
        balance: Math.floor(Math.random() * 3000),
        address: `${client.streetAddress}, ${client.city}`,
        status: statuses[index],
        nextBillingDate: new Date(Date.now() + (Math.random() * 30) * 24 * 60 * 60 * 1000),
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      }))
    );
    console.log(`   Created ${subscriptions.length} subscriptions`);

    // Create payment history
    console.log('💰 Creating payment history...');
    const paymentMethods = ['Cash', 'GCash', 'Maya', 'Bank Transfer', 'Credit Card'];
    const paymentStatuses = ['Paid', 'Paid', 'Paid', 'Not Yet Paid', 'Paid'];
    
    const payments = [];
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const subscription = subscriptions[i];
      const plan = plans[i % plans.length];
      
      // Create 3 months of payment history
      for (let month = 0; month < 3; month++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() - month);
        dueDate.setDate(Math.floor(1 + Math.random() * 28));
        
        const isPaid = month > 0 || Math.random() > 0.3;
        
        payments.push({
          userId: client._id,
          subscriptionId: subscription._id,
          description: `Monthly subscription - ${plan.name}`,
          method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          amount: plan.price,
          status: isPaid ? 'Paid' : 'Not Yet Paid',
          dueDate,
          datePaid: isPaid ? new Date(dueDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
          nextDueDate: new Date(dueDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        });
      }
    }
    
    await PaymentHistory.create(payments);
    console.log(`   Created ${payments.length} payment records`);

    // Create support tickets
    console.log('🎫 Creating support tickets...');
    const ticketData = [
      { title: 'Slow internet connection', description: 'My internet has been very slow for the past few days. Speed test shows only 5 Mbps when I should be getting 30 Mbps.', priority: 'High', category: 'Technical' },
      { title: 'Billing inquiry', description: 'I was charged twice for this month. Please help me resolve this.', priority: 'Medium', category: 'Billing' },
      { title: 'Request for plan upgrade', description: 'I would like to upgrade from Basic to Premium plan. What is the process?', priority: 'Low', category: 'Account' },
      { title: 'No internet connection', description: 'My internet has been down since this morning. Router lights are blinking red.', priority: 'Critical', category: 'Technical' },
      { title: 'Change billing date', description: 'Can I change my billing date from the 15th to the 1st of every month?', priority: 'Low', category: 'Billing' }
    ];

    const tickets = await SupportTicket.create(
      ticketData.map((ticket, index) => ({
        ...ticket,
        userId: clients[index]._id,
        status: index === 3 ? 'In Progress' : index === 4 ? 'Resolved' : 'Open'
      }))
    );
    console.log(`   Created ${tickets.length} support tickets`);

    // Create installations
    console.log('🔧 Creating installations...');
    const timeSlots = ['Morning (8AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-8PM)'];
    const installationStatuses = ['Scheduled', 'In Progress', 'Completed', 'Scheduled', 'Completed'];
    
    const installations = await Installation.create(
      clients.slice(0, 5).map((client, index) => ({
        userId: client._id,
        subscriptionId: subscriptions[index]._id,
        preferredDate: new Date(Date.now() + (index - 2) * 24 * 60 * 60 * 1000),
        preferredTime: timeSlots[index % timeSlots.length],
        address: `${client.streetAddress}, ${client.city}`,
        contactNumber: client.phoneNumber,
        status: installationStatuses[index],
        assignedTechnician: index % 2 === 0 ? 'Tech Team A' : 'Tech Team B',
        notes: index === 0 ? 'Customer requested call 30 minutes before arrival' : undefined
      }))
    );
    console.log(`   Created ${installations.length} installations`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@warzone.com / admin123');
    console.log('   Client: juan@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
