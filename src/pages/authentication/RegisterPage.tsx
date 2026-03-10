import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { serviceAreas } from "@/constants";

const RegisterPage = () => {
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (data: Record<string, string>) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await auth.register({ ...data, roles: ["client"] }, data.password);
    } catch (err) {
      const error = err as Record<string, string>;
      setError(error.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b bg-black text-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="fa-solid fa-wifi text-xl text-[#78fbcf]" />
            <span className="text-xl font-bold tracking-tight uppercase">
              Warzone
            </span>
          </div>

          <Button asChild className="bg-[#78fbcf] text-black hover:opacity-90">
            <a href="/login">Login</a>
          </Button>
        </div>
      </nav>

      {/* FORM SECTION */}
      <div className="flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mb-8 text-gray-600">
            Fill in your details to get started with high-speed internet.
          </p>

          {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          <RenderForm wrapperClassName="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Fields unchanged */}
              <RenderFormField
                field={{
                  label: "First Name *",
                  type: "text",
                  name: "first_name",
                  placeholder: "Juan",
                }}
              />

              <RenderFormField
                field={{
                  label: "Last Name *",
                  type: "text",
                  name: "last_name",
                  placeholder: "Dela Cruz",
                }}
              />

              <RenderFormField
                field={{
                  label: "Password *",
                  type: "password",
                  name: "password",
                  placeholder: "••••••••",
                }}
              />

              <RenderFormField
                field={{
                  label: "Email *",
                  type: "email",
                  name: "email",
                  placeholder: "youremail@gmail.com",
                }}
              />

              <RenderFormField
                field={{
                  label: "Phone Number *",
                  type: "text",
                  name: "phone_number",
                  placeholder: "+63 9XX XXX XXXX",
                }}
              />

              <RenderFormField
                field={{
                  label: "Street Address *",
                  type: "text",
                  name: "street_address",
                  placeholder: "123 Main St",
                }}
              />

              <RenderFormField
                field={{
                  label: "City/Municipality *",
                  type: "text",
                  name: "city_municipality",
                  placeholder: "City/Municipality",
                }}
              />

              <RenderFormField
                field={{
                  label: "Barangay *",
                  type: "text",
                  name: "barangay",
                  placeholder: "Barangay",
                }}
              />

              <RenderFormField
                field={{
                  label: "ZIP Code *",
                  type: "text",
                  name: "zip_code",
                  placeholder: "10001",
                }}
              />

              <RenderFormField
                field={{
                  label: "Service Area *",
                  type: "select",
                  name: "service_area",
                  options: serviceAreas,
                }}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <RenderFormButton
                onSubmit={handleRegister}
                isDisabled={auth.isLocked || isSubmitting}
                buttonLabel={isSubmitting ? "Creating..." : "Create Account"}
              />

              <Button asChild>
                <a href="/login">Back to Login</a>
              </Button>
            </div>
          </RenderForm>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
