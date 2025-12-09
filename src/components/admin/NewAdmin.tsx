import React, { useState } from 'react';
import { Home, Users, Wifi, Wrench, DollarSign, Bell, User, Search, Edit, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    Active: '',
    'Non-active': '',
    Waiting: '',
    All: ''
  });

  const mockCustomers = {
    Active: [
      { id: 1, name: 'Juan Dela Cruz', plan: 'Fiber 50Mbps', status: 'Active', payment: 'Paid', amount: '₱1,500', dueDate: '12/15/2025' },
      { id: 2, name: 'Maria Santos', plan: 'Fiber 100Mbps', status: 'Active', payment: 'Paid', amount: '₱2,500', dueDate: '12/18/2025' },
      { id: 3, name: 'Pedro Garcia', plan: 'Fiber 25Mbps', status: 'Active', payment: 'Paid', amount: '₱1,200', dueDate: '12/20/2025' },
      { id: 4, name: 'Ana Reyes', plan: 'Fiber 50Mbps', status: 'Active', payment: 'Pending', amount: '₱1,500', dueDate: '12/10/2025' },
    ],
    'Non-active': [
      { id: 5, name: 'Carlos Mendoza', plan: 'Fiber 50Mbps', status: 'Suspended', payment: 'Overdue', amount: '₱1,500', dueDate: '11/15/2025' },
      { id: 6, name: 'Lisa Tan', plan: 'Fiber 100Mbps', status: 'Disconnected', payment: 'Unpaid', amount: '₱2,500', dueDate: '10/20/2025' },
      { id: 7, name: 'Robert Cruz', plan: 'Fiber 25Mbps', status: 'Suspended', payment: 'Overdue', amount: '₱1,200', dueDate: '11/25/2025' },
    ],
    Waiting: [
      { id: 8, name: 'Sofia Martinez', plan: 'Fiber 50Mbps', status: 'Pending Installation', payment: 'Deposit Paid', amount: '₱1,500', dueDate: '12/25/2025' },
      { id: 9, name: 'David Lee', plan: 'Fiber 100Mbps', status: 'Pending Approval', payment: 'Not Yet', amount: '₱2,500', dueDate: '12/30/2025' },
    ],
    All: [
      { id: 1, name: 'Juan Dela Cruz', plan: 'Fiber 50Mbps', status: 'Active', payment: 'Paid', amount: '₱1,500', dueDate: '12/15/2025' },
      { id: 2, name: 'Maria Santos', plan: 'Fiber 100Mbps', status: 'Active', payment: 'Paid', amount: '₱2,500', dueDate: '12/18/2025' },
      { id: 3, name: 'Pedro Garcia', plan: 'Fiber 25Mbps', status: 'Active', payment: 'Paid', amount: '₱1,200', dueDate: '12/20/2025' },
      { id: 4, name: 'Ana Reyes', plan: 'Fiber 50Mbps', status: 'Active', payment: 'Pending', amount: '₱1,500', dueDate: '12/10/2025' },
      { id: 5, name: 'Carlos Mendoza', plan: 'Fiber 50Mbps', status: 'Suspended', payment: 'Overdue', amount: '₱1,500', dueDate: '11/15/2025' },
      { id: 6, name: 'Lisa Tan', plan: 'Fiber 100Mbps', status: 'Disconnected', payment: 'Unpaid', amount: '₱2,500', dueDate: '10/20/2025' },
      { id: 7, name: 'Robert Cruz', plan: 'Fiber 25Mbps', status: 'Suspended', payment: 'Overdue', amount: '₱1,200', dueDate: '11/25/2025' },
      { id: 8, name: 'Sofia Martinez', plan: 'Fiber 50Mbps', status: 'Pending Installation', payment: 'Deposit Paid', amount: '₱1,500', dueDate: '12/25/2025' },
      { id: 9, name: 'David Lee', plan: 'Fiber 100Mbps', status: 'Pending Approval', payment: 'Not Yet', amount: '₱2,500', dueDate: '12/30/2025' },
    ]
  };

  const stats = [
    { title: 'CASH BALANCE', value: '0', color: 'blue', icon: '💰' },
    { title: "THIS MONTH'S INCOME", value: '0', subtitle: 'Difference: 0', color: 'green', icon: '💵' },
    { title: 'EXPENDITURE OF THE MONTH', value: '0', color: 'cyan', icon: '📊' },
    { title: 'WAITING FOR PAYMENT', value: '0 Bill (0)', subtitle: 'Not including VAT', color: 'yellow', icon: '⏳' },
    { title: 'COVERAGE AREA', value: '1', color: 'gray', icon: '🗺️' },
    { title: 'PENDING TICKET', value: '0', color: 'red', icon: '🎫' },
    { title: 'PROCESS TICKET', value: '0', color: 'orange', icon: '🔧' },
    { title: 'TICKET DONE', value: '0', color: 'teal', icon: '✅' }
  ];

  const borderColors = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    cyan: 'border-l-cyan-500',
    yellow: 'border-l-yellow-500',
    gray: 'border-l-gray-500',
    red: 'border-l-red-500',
    orange: 'border-l-orange-500',
    teal: 'border-l-teal-500'
  };

  const handleSearchChange = (category, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const filterCustomers = (customers, searchTerm) => {
    if (!searchTerm) return customers;
    
    const term = searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(term) ||
      customer.plan.toLowerCase().includes(term) ||
      customer.status.toLowerCase().includes(term) ||
      customer.payment.toLowerCase().includes(term) ||
      customer.amount.toLowerCase().includes(term) ||
      customer.dueDate.includes(term)
    );
  };

  const renderCustomerTable = (category, headerBg, customers) => {
    const filteredCustomers = filterCustomers(customers, searchTerms[category]);
    
    return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className={`p-4 border-b border-gray-200 ${headerBg}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {category} Customers
            <span className="ml-2 text-sm text-gray-600">
              ({filteredCustomers.length} of {customers.length} customers)
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerms[category]}
                onChange={(e) => handleSearchChange(category, e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {searchTerms[category] && (
              <button
                onClick={() => handleSearchChange(category, '')}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={`${category}-${customer.id}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{customer.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.plan}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                      customer.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800' :
                      customer.status === 'Disconnected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.payment === 'Paid' ? 'bg-green-100 text-green-800' :
                      customer.payment === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      customer.payment === 'Overdue' || customer.payment === 'Unpaid' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {customer.payment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{customer.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.dueDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  No customers found matching "{searchTerms[category]}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white flex-shrink-0">
        <div className="p-4 flex items-center gap-2">
          <Wifi className="w-8 h-8" />
          <span className="text-xl font-bold">OXAPS PH</span>
        </div>
        
        <nav className="mt-8">
          <a href="#" className="flex items-center gap-3 px-6 py-3 bg-indigo-700 border-l-4 border-white">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </a>
          
          <div className="mt-2">
            <button 
              onClick={() => setIsCustomerMenuOpen(!isCustomerMenuOpen)}
              className="flex items-center justify-between w-full px-6 py-3 hover:bg-indigo-700"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span>Customer</span>
              </div>
              <span>{isCustomerMenuOpen ? '▼' : '›'}</span>
            </button>
          </div>
          
          <a href="#" className="flex items-center gap-3 px-6 py-3 mt-2 hover:bg-indigo-700">
            <Wifi className="w-5 h-5" />
            <span>Coverage Area</span>
          </a>
          
          <button className="flex items-center justify-between w-full px-6 py-3 mt-2 hover:bg-indigo-700">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5" />
              <span>Service</span>
            </div>
            <span>›</span>
          </button>
          
          <button className="flex items-center justify-between w-full px-6 py-3 mt-2 hover:bg-indigo-700">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5" />
              <span>Bill</span>
            </div>
            <span>›</span>
          </button>
          
          <button className="flex items-center justify-between w-full px-6 py-3 mt-2 hover:bg-indigo-700">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5" />
              <span>Finance</span>
            </div>
            <span>›</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-light text-gray-600">JPK NETWORK</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">10/21/2021 - 1:39:13 PM</span>
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
            </button>
            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-green-100 border border-green-200 text-green-700 px-6 py-3 m-6 rounded">
          <span className="mr-2">✓</span>
          Welcome back Karl Comboy
        </div>

        {/* Customer Tables - Show all categories */}
        {isCustomerMenuOpen && (
          <div className="mx-6 mb-6">
            {renderCustomerTable('Active', 'bg-green-50', mockCustomers.Active)}
            {renderCustomerTable('Non-active', 'bg-red-50', mockCustomers['Non-active'])}
            {renderCustomerTable('Waiting', 'bg-blue-50', mockCustomers.Waiting)}
            {renderCustomerTable('All', 'bg-indigo-50', mockCustomers.All)}
          </div>
        )}

        {/* Stats Grid */}
        {!isCustomerMenuOpen && (
          <div className="grid grid-cols-4 gap-4 p-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow p-4 border-l-4 ${borderColors[stat.color]}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                    )}
                  </div>
                  <span className="text-3xl opacity-20">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Section */}
        {!isCustomerMenuOpen && (
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* Income of the Year */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Income of the Year</h2>
              <div className="space-y-2">
                <div className="text-gray-400">P1</div>
                <div className="text-gray-400">P1</div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Control Panel</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <div className="text-indigo-600 mb-2">
                    <Users className="w-8 h-8" />
                  </div>
                  <span className="text-4xl font-bold text-gray-800 mb-1">1</span>
                  <span className="text-gray-600">Service</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <div className="text-indigo-600 mb-2">
                    <Users className="w-8 h-8" />
                  </div>
                  <span className="text-4xl font-bold text-gray-800 mb-1">2</span>
                  <span className="text-gray-600">Customer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;