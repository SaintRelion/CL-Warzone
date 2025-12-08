import { Button } from "@/components/ui/button";
import { useRegisterUser } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toDate, getCurrentDateTimeString } from "@saintrelion/time-functions";

const RegisterPage = () => {
  const getMinDate = () => {
    const tomorrow = toDate(getCurrentDateTimeString());
    if (tomorrow == null) return "";

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

  const registerUser = useRegisterUser();

  const handleRegister = (data: Record<string, string>) => {
    data.role = "client";
    registerUser.run({ info: data, password: data.password });
  };

  return (
    <RenderForm wrapperClass="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 px-4 py-8">
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

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RenderFormField
                  field={{
                    label: "First Name *",
                    type: "text",
                    name: "firstName",
                    placeholder: "Juan",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-700"
                  inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
                <RenderFormField
                  field={{
                    label: "Last Name *",
                    type: "text",
                    name: "lastName",
                    placeholder: "Dela Cruz",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-700"
                  inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <RenderFormField
                field={{
                  label: "Password *",
                  type: "password",
                  name: "password",
                }}
                labelClassName="mb-2 block text-sm font-medium text-gray-700"
                inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              />
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
              <RenderFormField
                field={{
                  label: "Email Address *",
                  description: "We'll send confirmation and updates here",
                  type: "email",
                  name: "emailAddress",
                  placeholder: "youremail@gmail.com",
                }}
                labelClassName="mb-2 block text-sm font-medium text-gray-700"
                descriptionClassName="mb-1 text-xs text-gray-500"
                inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              />
              <RenderFormField
                field={{
                  label: "Phone Number *",
                  description: "For installation coordination",
                  type: "text",
                  name: "phoneNumber",
                  placeholder: "+63 9XX XXX XXXX",
                }}
                labelClassName="mb-2 block text-sm font-medium text-gray-700"
                descriptionClassName="mb-1 text-xs text-gray-500"
                inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              />
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
              <RenderFormField
                field={{
                  label: "Street Address *",
                  type: "text",
                  name: "streetAddress",
                  placeholder: "123 Main Street, Apt 4B",
                }}
                labelClassName="mb-2 block text-sm font-medium text-gray-700"
                inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RenderFormField
                  field={{
                    label: "City *",
                    type: "text",
                    name: "city",
                    placeholder: "City",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-700"
                  inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
                <RenderFormField
                  field={{
                    label: "ZIP Code *",
                    type: "text",
                    name: "zipCode",
                    placeholder: "10001",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-700"
                  inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <RenderFormField
                field={{
                  label: "Service Area *",
                  description: "Pricing may vary by location",
                  type: "select",
                  name: "serviceArea",
                  options: serviceAreas,
                }}
                labelClassName="mb-2 block text-sm font-medium text-gray-700"
                descriptionClassName="mb-1 text-xs text-gray-500"
                inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Installation Schedule
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
                4
              </span>
              Installation Schedule
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <RenderFormField
                field={{
                  label: "Preferred Date *",
                  description: "Earliest available: Tomorrow",
                  type: "date",
                  name: "preferredDate",
                  minDate: getMinDate(),
                }}
                labelClassName="mb-2 block text-sm font-medium text-gray-700"
                descriptionClassName="mb-1 text-xs text-gray-500"
                inputClassName="w-full rounded-lg border border-gray-300 px-4 py-2 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              />
              <RenderFormField
                field={{
                  label: "Preferred Time *",
                  description: "Subject to technician availability",
                  type: "select",
                  name: "preferredTime",
                  options: timeSlots,
                }}
                labelClassName="mb-2 block text-sm font-medium text-gray-700"
                descriptionClassName="mb-1 text-xs text-gray-500"
                inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div> */}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <RenderFormButton
              onSubmit={handleRegister}
              buttonLabel="Create Account"
              buttonClassName="flex-1 rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
            />

            <Button
              asChild
              className="flex-1 cursor-pointer rounded-lg bg-gray-200 py-3 text-center font-medium text-gray-800 transition hover:bg-gray-300"
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
