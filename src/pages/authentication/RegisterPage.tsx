
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRegisterUser } from "@saintrelion/auth-lib";
import { RenderForm, RenderFormButton, RenderFormField } from "@saintrelion/forms";
import { toDate, getCurrentDateTimeString } from "@saintrelion/time-functions";

const PasswordField = ({ name, label }: { name: string; label: string }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-600"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        <span className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} />
      </button>
    </div>
  );
};

const RegisterPage = () => {
  const getMinDate = () => {
    const tomorrow = toDate(getCurrentDateTimeString());
    if (!tomorrow) return "";
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const timeSlots = ["8:00 AM - 12:00 PM", "1:00 PM - 5:00 PM", "6:00 PM - 8:00 PM"];
  const serviceAreas = ["Metro Manila", "Cebu City", "Davao City", "Baguio City", "Iloilo City", "Cagayan de Oro"];
  const registerUser = useRegisterUser();

  const handleRegister = (data: Record<string, string>) => {
    data.role = "client";
    registerUser.run({ info: data, password: data.password });
  };

  return (
    <RenderForm wrapperClass="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[80vh] bg-white rounded-xl shadow-2xl p-6 flex flex-col sm:flex-row overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden sm:flex sm:flex-col sm:justify-center sm:items-center sm:w-1/3 bg-indigo-600 rounded-l-xl text-white p-6">
          <span className="fa-solid fa-wifi text-5xl mb-4" />
          <h1 className="text-3xl font-bold">Warzone</h1>
          <p className="mt-2 text-lg text-indigo-100 text-center">
            Fast & reliable internet, just a few steps away.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="sm:w-2/3 overflow-y-auto p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Create Account</h2>
          <p className="text-gray-600 mb-6">Fill in your details to get started with high-speed internet</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Personal Details */}
            <RenderFormField
              field={{ label: "First Name *", type: "text", name: "firstName", placeholder: "Juan" }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{ label: "Last Name *", type: "text", name: "lastName", placeholder: "Dela Cruz" }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />

            {/* Password with toggle */}
              <RenderFormField
            field={{
              label: "Password",
              type: "password",
              name: "password",
              placeholder: "••••••••",
            }}
            labelClassName="mb-2 block text-sm font-medium text-gray-700"
            inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
          />

            {/* Contact Details */}
            <RenderFormField
              field={{ label: "Email Address *", type: "email", name: "emailAddress", placeholder: "youremail@gmail.com" }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{ label: "Phone Number *", type: "text", name: "phoneNumber", placeholder: "+63 9XX XXX XXXX" }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />

            {/* Service Address */}
            <RenderFormField
              field={{ label: "Street Address *", type: "text", name: "streetAddress", placeholder: "123 Main St" }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{ label: "City *", type: "text", name: "city", placeholder: "City/Municipality" }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{ label: "Barangay *", type: "text", name: "Barangay", placeholder: "Barangay" }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{ label: "ZIP Code *", type: "text", name: "zipCode", placeholder: "10001" }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{ label: "Service Area *", type: "select", name: "serviceArea", options: serviceAreas }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <RenderFormButton
              onSubmit={handleRegister}
              buttonLabel="Create Account"
              buttonClassName="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700 transition"
            />
            <Button asChild className="flex-1 rounded-lg bg-gray-200 py-3 text-gray-800 hover:bg-gray-300 transition">
              <a href="/login">Back to Login</a>
            </Button>
          </div>
        </div>
      </div>
    </RenderForm>
  );
};

export default RegisterPage;



	 
      
 
 