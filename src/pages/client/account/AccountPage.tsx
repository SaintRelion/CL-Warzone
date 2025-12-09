import { useState } from "react";
import { useAuth } from "@saintrelion/auth-lib";

const AccountPage = () => {
  const { user } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    phoneNumber: user.phoneNumber,
    streetAddress: user.streetAddress,
    city: user.city,
    zipCode: user.zipCode,
    serviceArea: user.serviceArea,
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Account Information
          </h2>
          <p className="mt-1 text-gray-600">
            Manage your personal and contact details
          </p>
        </div>

        {/* Edit / Save Buttons */}
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white font-semibold shadow hover:bg-indigo-700"
          >
            Edit Information
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              className="rounded-lg bg-green-600 px-5 py-2 text-white font-semibold shadow hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setForm({ ...user }); // reset
              }}
              className="rounded-lg bg-gray-200 px-5 py-2 font-semibold text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
{/* Info Card */}
<div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8 border border-gray-100">
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    {/* Form Fields */}
    {[
      { label: "First Name", key: "firstName" },
      { label: "Last Name", key: "lastName" },
      { label: "Email Address", key: "emailAddress" },
      { label: "Phone Number", key: "phoneNumber" },
      { label: "Street Address", key: "streetAddress", full: true },
      { label: "City", key: "city" },
      { label: "ZIP Code", key: "zipCode" },
      { label: "Service Area", key: "serviceArea" },
    ].map((field) => (
      <div key={field.key} className={field.full ? "sm:col-span-2" : ""}>
        {/* Gradient & Shadow Label */}
        <label className="block mb-1.5 text-sm font-semibold tracking-wide">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
            {field.label}
          </span>
        </label>

        {/* Display Mode */}
        {!editMode ? (
          <p className="text-lg text-gray-900 break-words bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            {form[field.key as keyof typeof form]}
          </p>
        ) : (
          <input
            name={field.key}
            value={form[field.key as keyof typeof form]}
            onChange={handleChange}
            type="text"
            className="
              w-full rounded-lg 
              border border-gray-300 
              bg-white 
              px-3 py-2 
              text-gray-900 
              shadow-md 
              focus:border-indigo-500 
              focus:ring-2 focus:ring-indigo-300 
              transition-all duration-200
            "
          />
        )}
      </div>
    ))}
  </div>
</div>


      {/* DELETE ACCOUNT */}
      <div className="border-t pt-6">
        <button className="rounded-lg bg-red-600 px-5 py-2 text-white font-semibold shadow hover:bg-red-700">
          Delete Account
        </button>
        <p className="mt-1 text-sm text-red-500">
          Warning: This action cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default AccountPage;
