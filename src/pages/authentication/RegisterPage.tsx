const RegisterPage = () => {
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const timeSlots = [
    "8:00 AM - 12:00 PM",
    "1:00 PM - 5:00 PM",
    "6:00 PM - 8:00 PM",
  ];

  const serviceAreas = [
    "Metro Manila",
    "Cebu City",
    "Davao City",
    "Baguio City",
    "Iloilo City",
    "Cagayan de Oro",
  ];

  const handleRegister = (data: Record<string, string>) => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-center">
          <span className="fa-solid fa-wifi text-2xl text-indigo-600" />
          <h1 className="ml-2 text-2xl font-bold text-gray-900">InternetPro</h1>
        </div>

        <h2 className="mb-2 text-3xl font-bold text-gray-900">
          Create Account
        </h2>
        <p className="mb-8 text-gray-600">
          Fill in your details to get started with high-speed internet
        </p>

        <div className="space-y-6">
          {/* Personal Details */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
                1
              </span>
              Personal Details
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="Juan"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="Dela Cruz"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
                2
              </span>
              Contact Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <p className="mb-1 text-xs text-gray-500">
                  We'll send confirmation and updates here
                </p>
                <input
                  type="email"
                  placeholder="juan@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <p className="mb-1 text-xs text-gray-500">
                  For installation coordination
                </p>
                <input
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Service Address */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
                3
              </span>
              Service Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Street Address *
                </label>
                <input
                  type="text"
                  placeholder="123 Main Street, Apt 4B"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    placeholder="10001"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Service Area *
                </label>
                <p className="mb-1 text-xs text-gray-500">
                  Pricing may vary by location
                </p>
                <select className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600">
                  {serviceAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Installation Schedule */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
                4
              </span>
              Installation Schedule
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Preferred Date *
                </label>
                <p className="mb-1 text-xs text-gray-500">
                  Earliest available: Tomorrow
                </p>
                <input
                  type="date"
                  min={getMinDate()}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Preferred Time *
                </label>
                <p className="mb-1 text-xs text-gray-500">
                  Subject to technician availability
                </p>
                <select className="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600">
                  <option value="">Select time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button className="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700">
              Create Account
            </button>
            <a
              href="/login"
              className="flex-1 rounded-lg bg-gray-200 py-3 text-center font-medium text-gray-800 transition hover:bg-gray-300"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
