// src/pages/LandingPage.tsx

import { useState } from "react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { Plan } from "@/models/Plan";
import LoginModal from "./LoginPage";

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { useList: getPlans } = useResourceLocked<Plan>("plan", {
    showToast: false,
  });

  const { data: plans = [], isLoading, isError } = getPlans();

  /* ==========================================
     UI
  ========================================== */

  return (
    <>
      <div className="min-h-screen bg-black px-4 py-20 text-white">
        {/* =====================================
            NAVIGATION
        ===================================== */}
        <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="fa-solid fa-wifi text-xl text-[#78fbcf]" />
              <span className="text-xl font-bold tracking-wide uppercase">
                WARZONE NET CAFE
              </span>
            </div>

            <button
              onClick={() => setShowLoginModal(true)}
              className="rounded-lg bg-[#78fbcf] px-4 py-2 text-sm font-bold text-black transition hover:opacity-90"
            >
              Login
            </button>
          </div>
        </nav>

        {/* =====================================
            HERO SECTION
        ===================================== */}

        <section className="mx-auto mt-10 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Unstoppable Fiber Internet for Every Home
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Warzone Fiber delivers high-speed, low-latency internet with a
            powerful billing system that keeps you connected, informed, and in
            control.
          </p>
        </section>

        <div className="bg-black px-4 py-5 font-sans text-white">
          <div className="mx-auto mt-20 max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-[#78fbcf]">
              Why Choose Warzone?
            </h2>

            <div className="grid gap-8 text-gray-300 md:grid-cols-3">
              <div>
                <h3 className="mb-2 font-bold text-white">
                  ⚡ Blazing Fast Speed
                </h3>
                <p>
                  Experience ultra-fast fiber connection with stable bandwidth
                  for gaming and streaming.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-bold text-white">
                  🔒 Secure Billing System
                </h3>
                <p>
                  OTP-secured login, real-time payment tracking, and transparent
                  billing history.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-bold text-white">
                  📡 Reliable Coverage
                </h3>
                <p>
                  Serving Katipunan, Roxas, Piñan, Osmeña, and Polanco with
                  dependable fiber infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================
            PLANS SECTION
        ===================================== */}

        <section className="mx-auto mt-20 max-w-3xl">
          {isLoading && (
            <div className="text-center text-gray-400">Loading plans...</div>
          )}

          {isError && (
            <div className="text-center text-red-500">
              Failed to load plans.
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {plans.map((plan, index) => {
                // Determine if this plan should be "featured"
                const isFeatured = plan.name === "Pro Fiber";

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-8 transition-colors ${
                      isFeatured
                        ? "transform bg-[#78fbcf] text-black shadow-2xl shadow-[#78fbcf]/10 md:scale-105"
                        : "border border-[#1f1f1f] bg-[#0f0f0f] text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <h3
                      className={`mb-4 ${isFeatured ? "font-bold" : "font-medium"}`}
                    >
                      {plan.name}
                    </h3>

                    <div className="mb-2 flex items-baseline">
                      <span className="text-4xl font-bold">₱{plan.price}</span>
                      <span
                        className={`ml-2 ${isFeatured ? "text-black/70" : "text-gray-500"}`}
                      >
                        /month
                      </span>
                    </div>

                    <p
                      className={`mb-8 text-sm ${isFeatured ? "font-medium text-black/70" : "text-gray-400"}`}
                    >
                      {plan.description}
                    </p>

                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={`mb-8 w-full rounded-xl py-3 font-semibold transition-colors ${
                        isFeatured
                          ? "bg-black text-white hover:bg-black/80"
                          : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      Apply Now
                    </button>

                    <div
                      className={`space-y-4 text-sm ${isFeatured ? "font-medium" : "text-gray-300"}`}
                    >
                      <p
                        className={`font-semibold ${isFeatured ? "font-bold" : "text-white"}`}
                      >
                        {index === 0 ? "" : "Everything in Starter +"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mx-auto mt-20 max-w-6xl px-4">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#08b47b]">
              Expanding Beyond Home Internet
            </h2>
            <p className="mx-auto max-w-2xl text-gray-500">
              Warzone Fiber is built to power growing businesses, institutions,
              and enterprises with scalable and secure network infrastructure.
            </p>
          </div>

          <div className="grid gap-8 text-gray-300 md:grid-cols-3">
            <div className="rounded-2xl border border-[#1f1f1f] bg-[#111] p-8 transition hover:border-[#78fbcf]">
              <h3 className="mb-3 font-bold text-white">🏢 Business Fiber</h3>
              <p className="mb-4 text-sm">
                Dedicated high-speed internet designed for offices, schools, and
                commercial establishments.
              </p>
              <ul className="space-y-2 text-sm">
                <li>✔ Symmetrical Upload & Download</li>
                <li>✔ Static IP Available</li>
                <li>✔ SLA Guaranteed Uptime</li>
                <li>✔ Priority Technical Support</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#1f1f1f] bg-[#111] p-8 transition hover:border-[#78fbcf]">
              <h3 className="mb-3 font-bold text-white">
                ☁ Cloud & Server Hosting
              </h3>
              <p className="mb-4 text-sm">
                Host your business applications, billing systems, and enterprise
                platforms securely.
              </p>
              <ul className="space-y-2 text-sm">
                <li>✔ VPS & Dedicated Servers</li>
                <li>✔ Secure Data Center</li>
                <li>✔ 24/7 Monitoring</li>
                <li>✔ Local Deployment Support</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#1f1f1f] bg-[#111] p-8 transition hover:border-[#78fbcf]">
              <h3 className="mb-3 font-bold text-white">
                📡 Network Infrastructure
              </h3>
              <p className="mb-4 text-sm">
                End-to-end fiber deployment and structured cabling for growing
                organizations.
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

        <div className="mx-auto mt-25 mb-10 max-w-5xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#08b47b]">
            Powering Communities & Businesses
          </h2>

          <p className="mb-10 text-gray-400">
            From households to enterprises, Warzone Fiber delivers reliable
            infrastructure built for long-term digital growth.
          </p>

          <div className="grid gap-6 text-sm text-gray-300 md:grid-cols-4">
            <div className="rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] p-6">
              🎮 Gaming Cafés
            </div>

            <div className="rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] p-6">
              🏫 Schools & Universities
            </div>

            <div className="rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] p-6">
              🏢 Corporate Offices
            </div>

            <div className="rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] p-6">
              🏬 Retail Establishments
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && <LoginModal showLogin={setShowLoginModal} />}
    </>
  );
};

export default LandingPage;
