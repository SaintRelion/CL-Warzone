import { useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "../to-be-library/sr-api";

const LoginPage = () => {
  const auth = useAuth();

  const [sendingOTP, setSendingOTP] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpId, setOtpId] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendOTP = async (email: string) => {
    try {
      setSendingOTP(true);
      const result = await apiRequest(
        "http://localhost:8000/api/otp_sms/send/",
        { email: email, type: "email" },
        { auth: false },
      );

      console.log(result);
      toast.success(`OTP sent to ${email} : | ${result.detail}`);
      setOtpId(result.otp_id);
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
      const result = await apiRequest(
        "http://localhost:8000/api/otp_sms/verify/",
        { otp_id: otpId, code: otpInput },
        { auth: false },
      );
      console.log(result);

      if (result.success == true) {
        setStatus("✅ OTP Verified");

        // Login the user
        await auth.login({
          username: email,
          password: password,
        });
      } else {
        setStatus("❌ Invalid OTP");
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleLogin = async (data: Record<string, string>) => {
    setEmail(data.email);
    setPassword(data.password);

    // await auth.login({
    //   username: data.email,
    //   password: data.password,
    // });
    await sendOTP(data.email);
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
            // LOGIN FORM
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
          ) : (
            // OTP VERIFICATION FORM
            <div className="flex flex-col gap-4">
              <p>
                OTP sent to <strong>{email}</strong>
              </p>
              {status && <p className="text-sm">{status}</p>}
              <input
                placeholder="Enter OTP"
                className="w-full rounded border p-3"
                value={otpInput}
                maxLength={6}
                onChange={(e) => setOtpInput(e.target.value)}
              />
              <Button
                onClick={verifyOTP}
                disabled={otpInput.length !== 6 || loading}
                className="rounded bg-green-500 py-2 text-white"
              >
                Verify OTP
              </Button>
            </div>
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
