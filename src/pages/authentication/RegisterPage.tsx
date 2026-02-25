import { Button } from "@/components/ui/button";
import { useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";

const RegisterPage = () => {
  const auth = useAuth();

  const serviceAreas = ["katipunan", "roxas", "piñan", "osmeña", "polanco"];

  const handleRegister = async (data: Record<string, string>) => {
    await auth.register({ ...data, roles: ["client"] }, data.password);
  };

  return (
    <RenderForm wrapperClassName="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
      <div className="flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white p-6 shadow-2xl sm:flex-row">
        {/* Left Side - Branding */}
        <div className="hidden rounded-l-xl bg-indigo-600 p-6 text-white sm:flex sm:w-1/3 sm:flex-col sm:items-center sm:justify-center">
          <span className="fa-solid fa-wifi mb-4 text-5xl" />
          <h1 className="text-3xl font-bold">Warzone</h1>
          <p className="mt-2 text-center text-lg text-indigo-100">
            Fast & reliable internet, just a few steps away.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="overflow-y-auto p-6 sm:w-2/3">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Create Account
          </h2>
          <p className="mb-6 text-gray-600">
            Fill in your details to get started with high-speed internet
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Personal Details */}
            <RenderFormField
              field={{
                label: "First Name *",
                type: "text",
                name: "first_name",
                placeholder: "Juan",
              }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{
                label: "Last Name *",
                type: "text",
                name: "last_name",
                placeholder: "Dela Cruz",
              }}
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
              field={{
                label: "Email *",
                type: "email",
                name: "email",
                placeholder: "youremail@gmail.com",
              }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{
                label: "Phone Number *",
                type: "text",
                name: "phone_number",
                placeholder: "+63 9XX XXX XXXX",
              }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />

            {/* Service Address */}
            <RenderFormField
              field={{
                label: "Street Address *",
                type: "text",
                name: "street_address",
                placeholder: "123 Main St",
              }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{
                label: "City/Municapality *",
                type: "text",
                name: "city_municipality",
                placeholder: "City/Municipality",
              }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{
                label: "Barangay *",
                type: "text",
                name: "barangay",
                placeholder: "Barangay",
              }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{
                label: "ZIP Code *",
                type: "text",
                name: "zip_code",
                placeholder: "10001",
              }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
            <RenderFormField
              field={{
                label: "Service Area *",
                type: "select",
                name: "service_area",
                options: serviceAreas,
              }}
              labelClassName="mb-2 block text-sm font-medium text-gray-700"
              inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="mt-6 flex gap-4">
            <RenderFormButton
              onSubmit={handleRegister}
              isDisabled={auth.isLocked}
              buttonLabel="Create Account"
              buttonClassName="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700 transition"
            />
            <Button
              asChild
              className="flex-1 rounded-lg bg-gray-200 py-3 text-gray-800 transition hover:bg-gray-300"
            >
              <a href="/login">Back to Login</a>
            </Button>
          </div>
        </div>
      </div>
    </RenderForm>
  );
};

export default RegisterPage;
