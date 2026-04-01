import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { municipalityOptions, serviceAreas, zipcodeMap } from "@/constants";
import { toast } from "@saintrelion/notifications";

const RegisterPage = () => {
  const auth = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [zipCode, setZipCode] = useState<string>("");

  const handleRegister = async (
    data: Record<string, string>,
  ): Promise<void> => {
    setError(null);

    const safeRegex: RegExp = /^[a-zA-Z0-9\s\-'.@)(,_\u00f1\u00d1]+$/;
    const invalidFields: string[] = Object.keys(data).filter((key: string) => {
      const value: string = data[key];
      // We only validate if there's actually text to check
      return value && !safeRegex.test(value);
    });

    // 3. Block if any "fancy" characters are found
    if (invalidFields.length > 0) {
      // Optionally format field names for the toast (e.g., first_name -> First Name)
      const fieldLabel: string = invalidFields[0].replace("_", " ");
      toast.warning(`Invalid characters detected in: ${fieldLabel}`);
      return;
    }
    setIsSubmitting(true);

    const formatValue = (val: string): string =>
      val.trim().charAt(0).toUpperCase() + val.trim().slice(1).toLowerCase();

    const payload = {
      ...data,
      roles: ["client"],
      first_name: formatValue(data.first_name),
      last_name: formatValue(data.last_name),
    };

    try {
      await auth.register(payload, data.password);
    } catch (err) {
      // Convert the error to a string to be safe
      const rawError: string = String(err);
      console.log("Raw Error caught:", rawError);

      try {
        // 1. Find the index where the JSON object actually starts
        const jsonStartIndex: number = rawError.indexOf("{");
        const jsonEndIndex: number = rawError.lastIndexOf("}");

        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
          // 2. Extract and parse only the JSON portion
          const jsonString: string = rawError.substring(
            jsonStartIndex,
            jsonEndIndex + 1,
          );
          const errorObj: Record<string, string[]> = JSON.parse(jsonString);

          // 3. Map the keys (email, username, etc.) to a readable string
          const formatted: string = Object.entries(errorObj)
            .map(([key, messages]) => {
              const fieldName: string =
                key.charAt(0).toUpperCase() + key.slice(1);
              return `${fieldName}: ${messages.join(", ")}`;
            })
            .join(" ");

          toast.error(formatted);
          setError(formatted);
        } else {
          // 4. If no JSON found, clean up the "Register failed:" prefix
          const cleanMessage: string = rawError
            .replace(/^Error:\s*/i, "")
            .replace(/^Register\s*failed:\s*/i, "");

          setError(cleanMessage || "Registration failed.");
        }
      } catch (parseErr: unknown) {
        // 5. Ultimate fallback if parsing explodes
        setError(
          "An unexpected error occurred during registration. Raw Error: " +
            parseErr,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-[#090909]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src="/my-logo.png" alt="Warzone Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              Warzone
            </span>
          </div>

          <Button
            asChild
            className="bg-amber-500 font-semibold text-black hover:bg-amber-600"
          >
            <a href="/login">Login</a>
          </Button>
        </div>
      </nav>

      {/* FORM SECTION */}
      <div className="flex items-center justify-center px-4 pt-28 pb-12">
        <div className="w-full max-w-4xl rounded-2xl border border-white/5 bg-[#090909] p-8 shadow-2xl">
          <h2 className="mb-2 text-3xl font-bold text-white">Create Account</h2>
          <p className="mb-8 text-gray-400">
            Fill in your details to get started with high-speed internet.
          </p>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          <RenderForm wrapperClassName="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <RenderFormField
                field={{
                  label: "First Name *",
                  type: "text",
                  name: "first_name",
                  placeholder: "Juan",
                }}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
              />

              <RenderFormField
                field={{
                  label: "Last Name *",
                  type: "text",
                  name: "last_name",
                  placeholder: "Dela Cruz",
                }}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
              />

              <RenderFormField
                field={{
                  label: "Password *",
                  type: "password",
                  name: "password",
                  placeholder: "••••••••",
                }}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
              />

              <RenderFormField
                field={{
                  label: "Email *",
                  type: "email",
                  name: "email",
                  placeholder: "youremail@gmail.com",
                }}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
              />

              <RenderFormField
                field={{
                  label: "Phone Number *",
                  type: "text",
                  name: "phone_number",
                  placeholder: "+63 9XX XXX XXXX",
                }}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
              />

              <RenderFormField
                field={{
                  label: "Street Address *",
                  type: "text",
                  name: "street_address",
                  placeholder: "123 Main St",
                }}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
              />

              <RenderFormField
                field={{
                  label: "City/Municipality *",
                  type: "select",
                  name: "city_municipality",
                  options: municipalityOptions,
                  onValueChange: (value) =>
                    setZipCode(zipcodeMap[value as string]),
                }}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
              />

              <RenderFormField
                field={{
                  label: "Barangay *",
                  type: "text",
                  name: "barangay",
                  placeholder: "Barangay",
                }}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
              />

              <RenderFormField
                field={{
                  label: "ZIP Code *",
                  type: "text",
                  name: "zip_code",
                  disabled: true,
                }}
                defaultValue={zipCode}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed outline-none"
              />

              <RenderFormField
                field={{
                  label: "Service Area *",
                  type: "select",
                  name: "service_area",
                  options: serviceAreas,
                }}
                labelClassName="text-gray-300 text-sm mb-1.5 block"
                inputClassName="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              <RenderFormButton
                onSubmit={handleRegister}
                isDisabled={auth.isLocked || isSubmitting}
                buttonLabel={isSubmitting ? "Creating..." : "Create Account"}
                buttonClassName="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              />

              <Button
                asChild
                variant="outline"
                className="border-white/10 py-6 text-gray-300 hover:bg-white/5 hover:text-white"
              >
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
