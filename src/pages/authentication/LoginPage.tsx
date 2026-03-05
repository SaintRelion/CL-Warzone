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

const LoginPage = ({ showLogin }: { showLogin: (status: boolean) => void }) => {
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requireOtp, setRequireOtp] = useState(false);
  const [checkingTrust, setCheckingTrust] = useState(false);

  const checkDevice = async (email: string, password: string) => {
    const result = await apiRequest(
      `${BASE_API}api/auth/check/device/`,
      { identifier: auth.deviceId, username: email, password: password },
      {
        auth: false,
      },
    );

    return result.is_trusted;
  };

  const handleLogin = async (data: Record<string, string>) => {
    setEmail(data.email);
    setPassword(data.password);

    setCheckingTrust(true);

    const isTrusted = await checkDevice(data.email, data.password);
    if (isTrusted) {
      await auth.login({
        username: data.email,
        password: data.password,
      });
    } else {
      setRequireOtp(true);
      setCheckingTrust(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        {/* Modal Container */}
        <div className="animate-fadeIn relative w-full max-w-md rounded-xl bg-[#090909] p-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={() => showLogin(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <div className="mb-8 flex items-center justify-center">
            <span className="fa-solid fa-wifi text-2xl text-indigo-600" />
            <h1 className="ml-2 text-2xl font-bold text-white">Warzone</h1>
          </div>

          {requireOtp == false ? (
            <>
              <RenderForm wrapperClassName="space-y-4">
                <RenderFormField
                  field={{
                    label: "Email",
                    type: "email",
                    name: "email",
                    placeholder: "your@gmail.com",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-200"
                  inputClassName="text-white w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
                <RenderFormField
                  field={{
                    label: "Password",
                    type: "password",
                    name: "password",
                    placeholder: "••••••••",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-200"
                  inputClassName="text-white w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
                <RenderFormButton
                  buttonLabel="Sign In"
                  isDisabled={auth.isLocked || checkingTrust}
                  onSubmit={handleLogin}
                  buttonClassName="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70"
                />
              </RenderForm>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-200">Don't have an account?</p>
                <a
                  href="/register"
                  className="mt-1 font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Create an account
                </a>
              </div>
            </>
          ) : (
            // OTP VERIFICATION FORM
            <OtpVerification email={email} password={password} />
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
