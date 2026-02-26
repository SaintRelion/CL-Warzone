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
  const [showLoginModal, setShowLoginModal] = useState(false);


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

      <div className="min-h-screen bg-black text-white py-20 px-4 font-sans">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-2">
              <span className="fa-solid fa-wifi text-xl text-[#78fbcf]" />
              <span className="text-xl font-bold tracking-tighter uppercase">Warzone</span>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-[#78fbcf] text-black px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-all">
                Login
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Unstoppable Fiber Internet for Every Home
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Warzone Fiber delivers high-speed, low-latency internet with a powerful
            billing system that keeps you connected, informed, and in control.
            Built for gamers, streamers, students, and growing businesses.
          </p>
          <div className="mt-10 inline-flex items-center bg-[#1a1a1a] p-1 rounded-lg">
            <button className="px-4 py-1.5 text-sm font-medium text-gray-400">Annually</button>
            <button className="px-4 py-1.5 text-sm font-medium bg-[#333333] text-white rounded-md shadow-sm">Monthly</button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h3 className="text-gray-400 font-medium mb-4">Basic Fiber</h3>
            <div className="flex items-baseline mb-2">
              <span className="text-4xl font-bold">₱999</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">
              Perfect for homes, students, and everyday browsing.
            </p>
            <button className="w-full py-3 bg-white text-black font-semibold rounded-xl mb-8 hover:bg-gray-200 transition-colors">
              Apply Now
            </button>
            <div className="space-y-4 text-sm text-gray-300">
              <p className="font-semibold text-white">Plan Includes:</p>
              <div className="flex items-start gap-3">
                <span>✔ Up to 50 Mbps Speed</span>
              </div>
              <div className="flex items-start gap-3">
                <span>✔ Unlimited Data</span>
              </div>
              <div className="flex items-start gap-3">
                <span>✔ Free Installation</span>
              </div>
              <div className="flex items-start gap-3">
                <span>✔ 24/7 Customer Support</span>
              </div>
            </div>
          </div>

          <div className="bg-[#78fbcf] rounded-2xl p-8 text-black transform md:scale-105 shadow-2xl shadow-[#78fbcf]/10">
            <h3 className="font-bold">Pro Gamer</h3>
            <div className="flex items-baseline mb-2">
              <span className="text-4xl font-bold">₱1,499</span>
              <span className="text-black/70 ml-2">/month</span>
            </div>
            <p className="text-black/70 text-sm mb-8 font-medium">
              Built for gamers, streamers, and remote professionals.
            </p>
            <button className="w-full py-3 bg-black text-white font-semibold rounded-xl mb-8 hover:bg-black/80 transition-colors">
              Apply Now
            </button>
            <div className="space-y-4 text-sm font-medium">
              <p className="font-bold">Everything in Basic +</p>
              <div className="flex items-start gap-3">
                <span>✔ Up to 100 Mbps Speed</span>
              </div>
              <div className="flex items-start gap-3">
                <span>✔ Low Latency Routing</span>
              </div>
              <div className="flex items-start gap-3">
                <span>✔ Priority Technical Support</span>
              </div>
              <div className="flex items-start gap-3">
                <span>✔ Free Router Upgrade</span>
              </div>
            </div>
          </div>


          <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 hover:border-gray-700 transition-colors">
            <h3 className="text-gray-400 font-medium mb-4">Enterprise Fiber</h3>

            <div className="flex items-baseline mb-2">
              <span className="text-4xl font-bold">₱2,999</span>
              <span className="text-gray-500 ml-2">/month</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">
              Designed for offices, businesses, and heavy users.
            </p>
            <button className="w-full py-3 bg-white text-black font-semibold rounded-xl mb-8 hover:bg-gray-200 transition-colors">
              Apply Now
            </button>
            <div className="space-y-4 text-sm text-gray-300">
              <p className="font-semibold text-white">Everything in Pro +</p>
              <div className="flex items-start gap-3">
                <span>✔ Up to 300 Mbps Speed</span>
              </div>
              <div className="flex items-start gap-3">
                <span>✔ Dedicated IP Option</span>
              </div>
              <div className="flex items-start gap-3">
                <span>✔ Service Level Agreement (SLA)</span>
              </div>
              <div className="flex items-start gap-3">
                <span>✔ Dedicated Account Manager</span>
              </div>
            </div>
          </div>

        </div>
        <div className="max-w-4xl mx-auto text-center mt-20">
          <h2 className="text-3xl font-bold mb-6 text-[#78fbcf]">
            Why Choose Warzone?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-gray-300">
            <div>
              <h3 className="font-bold text-white mb-2">⚡ Blazing Fast Speed</h3>
              <p>Experience ultra-fast fiber connection with stable bandwidth for gaming and streaming.</p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">🔒 Secure Billing System</h3>
              <p>OTP-secured login, real-time payment tracking, and transparent billing history.</p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">📡 Reliable Coverage</h3>
              <p>Serving Katipunan, Roxas, Piñan, Osmeña, and Polanco with dependable fiber infrastructure.</p>
            </div>
          </div>
        </div>

      </div>

<div className="max-w-6xl mx-auto mt-28 px-4">

  <div className="text-center mb-14">
    <h2 className="text-3xl font-bold text-[#78fbcf] mb-4">
      Expanding Beyond Home Internet
    </h2>
    <p className="text-gray-400 max-w-2xl mx-auto">
      Warzone Fiber is built to power growing businesses, institutions,
      and enterprises with scalable and secure network infrastructure.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-8 text-gray-300">

    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8 hover:border-[#78fbcf] transition">
      <h3 className="text-white font-bold mb-3">🏢 Business Fiber</h3>
      <p className="text-sm mb-4">
        Dedicated high-speed internet designed for offices, schools,
        and commercial establishments.
      </p>
      <ul className="space-y-2 text-sm">
        <li>✔ Symmetrical Upload & Download</li>
        <li>✔ Static IP Available</li>
        <li>✔ SLA Guaranteed Uptime</li>
        <li>✔ Priority Technical Support</li>
      </ul>
    </div>

    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8 hover:border-[#78fbcf] transition">
      <h3 className="text-white font-bold mb-3">☁ Cloud & Server Hosting</h3>
      <p className="text-sm mb-4">
        Host your business applications, billing systems,
        and enterprise platforms securely.
      </p>
      <ul className="space-y-2 text-sm">
        <li>✔ VPS & Dedicated Servers</li>
        <li>✔ Secure Data Center</li>
        <li>✔ 24/7 Monitoring</li>
        <li>✔ Local Deployment Support</li>
      </ul>
    </div>

    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8 hover:border-[#78fbcf] transition">
      <h3 className="text-white font-bold mb-3">📡 Network Infrastructure</h3>
      <p className="text-sm mb-4">
        End-to-end fiber deployment and structured cabling
        for growing organizations.
      </p>
      <ul className="space-y-2 text-sm">
        <li>✔ Fiber Installation</li>
        <li>✔ Structured Cabling</li>
        <li>✔ CCTV & Network Setup</li>
        <li>✔ IT Consultation</li>
      </ul>
    </div>

  </div>
</div>
<div className="max-w-5xl mx-auto mt-24 text-center px-4">

  <h2 className="text-3xl font-bold text-white mb-6">
    Powering Communities & Businesses
  </h2>

  <p className="text-gray-400 mb-10">
    From households to enterprises, Warzone Fiber delivers
    reliable infrastructure built for long-term digital growth.
  </p>

  <div className="grid md:grid-cols-4 gap-6 text-gray-300 text-sm">

    <div className="bg-[#0f0f0f] p-6 rounded-xl border border-[#1f1f1f]">
      🎮 Gaming Cafés
    </div>

    <div className="bg-[#0f0f0f] p-6 rounded-xl border border-[#1f1f1f]">
      🏫 Schools & Universities
    </div>

    <div className="bg-[#0f0f0f] p-6 rounded-xl border border-[#1f1f1f]">
      🏢 Corporate Offices
    </div>

    <div className="bg-[#0f0f0f] p-6 rounded-xl border border-[#1f1f1f]">
      🏬 Retail Establishments
    </div>

  </div>
</div>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

          {/* Modal Container */}
          <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl animate-fadeIn">

            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <div className="mb-8 flex items-center justify-center">
              <span className="fa-solid fa-wifi text-2xl text-indigo-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Warzone</h1>
            </div>

            {otpId === "" ? (
              <RenderForm wrapperClassName="space-y-4">
                <RenderFormField
                  field={{
                    label: "Email",
                    type: "email",
                    name: "email",
                    placeholder: "your@gmail.com",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-700"
                  inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:ring-2 focus:ring-indigo-600"
                />

                <RenderFormField
                  field={{
                    label: "Password",
                    type: "password",
                    name: "password",
                    placeholder: "••••••••",
                  }}
                  labelClassName="mb-2 block text-sm font-medium text-gray-700"
                  inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:ring-2 focus:ring-indigo-600"
                />

                <RenderFormButton
                  buttonLabel="Sign In"
                  isDisabled={sendingOTP}
                  onSubmit={handleLogin}
                  buttonClassName="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700"
                />
              </RenderForm>
            ) : (
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
      )}
    </>
  );
};

export default LoginPage;
