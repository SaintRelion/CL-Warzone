import { useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";
import { useState } from "react";
import { apiRequest } from "../to-be-library/sr-api";
import OtpVerification from "@/components/authentication/OtpVerificaction";

const LoginPage = () => {
  const auth = useAuth();

  const [sendingOTP, setSendingOTP] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">(
    "email",
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpId, setOtpId] = useState("");
  const [otpExpiration, setOtpExpiration] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendOTP = async (email: string) => {
    try {
      setSendingOTP(true);
      const endpoint =
        deliveryMethod === "sms"
          ? "http://localhost:8000/api/otp/send_sms/"
          : "http://localhost:8000/api/otp/send/";

      const payload =
        deliveryMethod === "sms"
          ? { email: email, type: "sms" } // backend can resolve phone from user
          : { email: email, type: "email" };

      const result = await apiRequest(endpoint, payload, { auth: false });

      console.log(result);
      if (result.otp_id) {
        toast.success(`OTP sent via ${deliveryMethod.toUpperCase()}`);

        setOtpId(result.otp_id);
        setOtpExpiration(result.expires_at);
      }
    } catch (error) {
      const err = error as Record<string, string>;
      console.log(`Failed to send OTP: ${err.message}`);
    } finally {
      setSendingOTP(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const endpoint =
        deliveryMethod === "sms"
          ? "http://localhost:8000/api/otp/verify_sms/"
          : "http://localhost:8000/api/otp/verify/";

      const result = await apiRequest(
        endpoint,
        { otp_id: otpId, code: otpInput },
        { auth: false },
      );

      console.log(result);
      if (result.success == true) {
        // Login the user
        await auth.login({
          username: email,
          password: password,
        });
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleLogin = async (data: Record<string, string>) => {
    setEmail(data.email);
    setPassword(data.password);

    await auth.login({
      username: data.email,
      password: data.password,
    });
    // await sendOTP(data.email);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-600 to-purple-600 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
          <div className="mb-8 flex items-center justify-center">
            <span className="fa-solid fa-wifi text-2xl text-indigo-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">Warzone</h1>
          </div>

          {otpId == "" ? (
            <>
              {/* Delivery Method Toggle */}
              <div className="mb-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("email")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    deliveryMethod === "email"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Email
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod("sms")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    deliveryMethod === "sms"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  SMS
                </button>
              </div>
              <RenderForm wrapperClassName="space-y-4">
                <RenderFormField
                  field={{
                    label: "Email",
                    type: "email",
                    name: "email",
                    placeholder: "your@gmail.com",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-700"
                  inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-600"
                />
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
                <RenderFormButton
                  buttonLabel="Sign In"
                  isDisabled={sendingOTP}
                  onSubmit={handleLogin}
                  buttonClassName="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
                />
              </RenderForm>
            </>
          ) : (
            // OTP VERIFICATION FORM
            <OtpVerification
              email={email}
              otpExpiration={otpExpiration}
              otpInput={otpInput}
              setOtpInput={setOtpInput}
              verifyOTP={verifyOTP}
              status={status ?? ""}
              loading={loading}
            />
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <a
              href="/register"
              className="mt-1 font-medium text-indigo-600 hover:text-indigo-700"
            >
              Create an account
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
