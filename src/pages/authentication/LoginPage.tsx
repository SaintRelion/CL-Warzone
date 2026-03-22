import { useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { useState } from "react";
import { apiRequest } from "../to-be-library/sr-api";
import OtpVerification from "@/components/authentication/OtpVerificaction";

import { BASE_API } from "@/sr-config";
import { toast } from "@saintrelion/notifications";

const LoginPage = ({ showLogin }: { showLogin: (status: boolean) => void }) => {
  const auth = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [requireOtp, setRequireOtp] = useState<boolean>(false);
  const [checkingTrust, setCheckingTrust] = useState<boolean>(false);

  const checkDevice = async (email: string, password: string) => {
    const result = await apiRequest(
      `${BASE_API}api/auth/trust/device/`,
      { identifier: auth.deviceId, username: email, password: password },
      {
        auth: false,
      },
    );

    return result;
  };

  const handleLogin = async (data: Record<string, string>): Promise<void> => {
    setEmail(data.email);
    setPassword(data.password);

    setCheckingTrust(true);

    const result = await checkDevice(data.email, data.password);
    if (result.is_trusted) {
      await auth.login({
        username: data.email,
        password: data.password,
      });
    } else if (!result.valid_user) {
      toast.warning("Invalid credentials");
    } else {
      setRequireOtp(true);
    }
    setCheckingTrust(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        {/* Modal Container */}
        <div className="animate-fadeIn relative w-full max-w-md rounded-xl border border-white/5 bg-[#090909] p-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={() => showLogin(false)}
            className="absolute top-4 right-4 text-gray-500 transition-colors hover:text-amber-500"
          >
            ✕
          </button>

          <div className="mb-8 flex items-center justify-center">
            {/* Actual Logo Implementation */}
            <img
              src="/my-logo.png"
              alt="Warzone Logo"
              className="h-10 w-auto object-contain"
            />
            <h1 className="ml-3 text-2xl font-bold tracking-tight text-white">
              Warzone
            </h1>
          </div>

          {requireOtp === false ? (
            <>
              <RenderForm wrapperClassName="space-y-4">
                <RenderFormField
                  field={{
                    label: "Email",
                    type: "email",
                    name: "email",
                    placeholder: "your@gmail.com",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-300"
                  // Updated focus ring to Amber (Dirty Yellow)
                  inputClassName="text-white w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/50"
                />
                <RenderFormField
                  field={{
                    label: "Password",
                    type: "password",
                    name: "password",
                    placeholder: "••••••••",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-300"
                  inputClassName="text-white w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/50"
                />
                <RenderFormButton
                  buttonLabel="Sign In"
                  isDisabled={auth.isLocked || checkingTrust}
                  onSubmit={handleLogin}
                  // Updated Button Colors
                  buttonClassName="w-full rounded-lg bg-amber-500 py-3 font-semibold text-black transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-50"
                />
              </RenderForm>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">Don't have an account?</p>
                <a
                  href="/register"
                  className="mt-1 inline-block font-medium text-amber-500 transition-colors hover:text-amber-400"
                >
                  Create an account
                </a>
              </div>
            </>
          ) : (
            <OtpVerification email={email} password={password} />
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
