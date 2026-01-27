import type { CreateOTP, VerifyOTP } from "@/models/OTP";
import { useAuth } from "@saintrelion/auth-lib";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const auth = useAuth();

  const { useList: getOTP, useInsert: insertOTP } = useResourceLocked<
    VerifyOTP,
    CreateOTP
  >("otpsmtp", { showConsoleLogs: false, showToast: false });

  const otps = getOTP().data;

  const [sendingOTP, setSendingOTP] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sendOTP = async () => {
    try {
      setSendingOTP(true);
      const randomPIN = Math.floor(100000 + Math.random() * 900000).toString();

      await insertOTP.run({
        randomPIN,
      });

      await emailjs.send(
        "service_sb73kdi", // from EmailJS dashboard
        "template_gz6iw72", // OTP email template
        {
          email: email,
          passcode: randomPIN,
        },
        "MbyggPp_mN3XQDDmC", // EmailJS public key
      );

      toast.success(`OTP sent to ${email}`);
      setOtpStep(true);
    } catch (error) {
      const err = error as Record<string, string>;
      console.log(err.message || "Failed to send OTP");
    } finally {
      setSendingOTP(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      setStatus(null);

      const found = otps.find((o) => o.randomPIN == otpInput);

      if (found) {
        setStatus("✅ OTP Verified");

        // Login the user
        await auth.login({
          username: email,
          password: password,
        });
      } else {
        setStatus("❌ Invalid OTP");
      }
    } catch (error) {
      const err = error as Record<string, string>;
      setStatus(err?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data: Record<string, string>) => {
    setEmail(data.email);
    setPassword(data.password);

    await sendOTP();
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-600 to-purple-600 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
          <div className="mb-8 flex items-center justify-center">
            <span className="fa-solid fa-wifi text-2xl text-indigo-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">Warzone</h1>
          </div>

          {!otpStep ? (
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
