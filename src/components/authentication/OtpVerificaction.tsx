import { useCountdown } from "@/pages/to-be-library/countdown";
import { Button } from "../ui/button";
import { useState } from "react";
import { BASE_API } from "@/sr-config";
import { apiRequest } from "@/pages/to-be-library/sr-api";
import { toast } from "@saintrelion/notifications";
import { useAuth } from "@saintrelion/auth-lib";

export default function OtpVerification({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const auth = useAuth();

  const [deliveryMethod, setDeliveryMethod] = useState("");

  const [otpId, setOtpId] = useState("");
  const [otpExpiration, setOtpExpiration] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Convert UTC string to Date if needed
  const expiresAtDate =
    typeof otpExpiration === "string" ? new Date(otpExpiration) : otpExpiration;

  const countdown = useCountdown(expiresAtDate);

  const isExpired = countdown === "00:00";

  const sendOTP = async (method: string) => {
    try {
      setDeliveryMethod(method);

      const payload =
        method === "sms"
          ? { email, password, otp_type: "sms" } // backend can resolve phone from user
          : { email, password, otp_type: "email" };

      const result = await apiRequest(`${BASE_API}api/otp/send/`, payload, {
        auth: false,
      });
      if (result.otp_id) {
        toast.success(`OTP sent via ${method.toUpperCase()}`);

        setOtpId(result.otp_id);
        setOtpExpiration(result.expires_at);
      }
    } catch (error) {
      const err = error as Record<string, string>;
      console.log(`Failed to send OTP: ${err.message}`);
      setDeliveryMethod("");
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const result = await apiRequest(
        `${BASE_API}api/otp/verify/`,
        { otp_id: otpId, code: otpInput },
        { auth: false },
      );

      console.log(result);
      if (result.success == true) {
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

  return otpId == "" ? (
    <div className="mb-4 flex justify-center gap-4">
      <button
        type="button"
        disabled={deliveryMethod != ""}
        onClick={() => sendOTP("email")}
        className={`rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70`}
      >
        Email
      </button>

      <button
        type="button"
        disabled={deliveryMethod != ""}
        onClick={() => sendOTP("sms")}
        className={`rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70`}
      >
        SMS
      </button>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      <p className="text-white">
        OTP sent to{" "}
        <strong>
          {deliveryMethod == "email" ? email : "Your registered phone number"}
        </strong>
      </p>
      {status && <p className="text-sm">{status}</p>}

      <input
        placeholder="Enter OTP"
        className="w-full rounded border p-3 text-white"
        value={otpInput}
        maxLength={6}
        onChange={(e) => setOtpInput(e.target.value)}
        disabled={isExpired}
      />

      <div
        className={`flex items-center justify-between rounded-lg px-3 py-1 text-sm ${
          isExpired ? "text-red-400" : "text-gray-400"
        }`}
      >
        <span className="font-medium">Expires in</span>
        <span className="font-mono">{countdown}</span>
      </div>

      <Button
        onClick={verifyOTP}
        disabled={otpInput.length !== 6 || loading || isExpired}
        className={`rounded py-2 text-white ${
          isExpired ? "cursor-not-allowed bg-gray-400" : "bg-green-500"
        }`}
      >
        Verify OTP
      </Button>

      {isExpired && <p className="text-sm text-red-500">OTP has expired</p>}
    </div>
  );
}
