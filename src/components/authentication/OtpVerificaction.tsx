import { useCountdown } from "@/pages/to-be-library/countdown";
import { Button } from "../ui/button";

export default function OtpVerification({
  email,
  deliveryMethod,
  otpExpiration,
  otpInput,
  setOtpInput,
  verifyOTP,
  status,
  loading,
}: {
  email: string;
  deliveryMethod: string;
  otpExpiration: string | Date;
  otpInput: string;
  setOtpInput: (val: string) => void;
  verifyOTP: () => void;
  status?: string;
  loading?: boolean;
}) {
  // Convert UTC string to Date if needed
  const expiresAtDate =
    typeof otpExpiration === "string" ? new Date(otpExpiration) : otpExpiration;

  const countdown = useCountdown(expiresAtDate);

  const isExpired = countdown === "00:00";

  return (
    <div className="flex flex-col gap-3">
      <p>
        OTP sent to{" "}
        <strong>
          {deliveryMethod == "email" ? email : "Your registered phone number"}
        </strong>
      </p>
      {status && <p className="text-sm">{status}</p>}

      <input
        placeholder="Enter OTP"
        className="w-full rounded border p-3"
        value={otpInput}
        maxLength={6}
        onChange={(e) => setOtpInput(e.target.value)}
        disabled={isExpired}
      />

      <div
        className={`flex items-center justify-between rounded-lg px-3 py-1 text-sm ${
          isExpired ? "text-red-700" : "text-gray-700"
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
