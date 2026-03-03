// src/pages/LandingPage.tsx

import { useState } from "react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { Plan } from "@/models/Plan";
import LoginModal from "./LoginPage";

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  /* ==========================================
     DATA FETCHING (LOCKED RESOURCE)
  ========================================== */

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
              <span className="text-xl font-bold uppercase tracking-wide">
                WARZONE
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

        <section className="mx-auto mt-16 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            Unstoppable Fiber Internet for Every Home
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Warzone Fiber delivers high-speed, low-latency internet with a
            powerful billing system that keeps you connected, informed, and in
            control.
          </p>
        </section>

        {/* =====================================
            PLANS SECTION
        ===================================== */}

        <section className="mx-auto mt-20 max-w-6xl">
          {isLoading && (
            <div className="text-center text-gray-400">
              Loading plans...
            </div>
          )}

          {isError && (
            <div className="text-center text-red-500">
              Failed to load plans.
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] p-8 transition hover:border-[#78fbcf]"
                >
                  <h3 className="mb-4 font-medium text-white">
                    {plan.name}
                  </h3>

                  <div className="mb-2 flex items-baseline">
                    <span className="text-4xl font-bold">
                      ₱{plan.price}
                    </span>
                    <span className="ml-2 text-gray-500">
                      /month
                    </span>
                  </div>

                  <p className="mb-8 text-sm text-gray-400">
                    {plan.description}
                  </p>

                  <button className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-gray-200">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =====================================
            YOU CAN KEEP ALL YOUR OTHER 
            MARKETING SECTIONS HERE
        ===================================== */}
      </div>

      {/* =====================================
          LOGIN MODAL
      ===================================== */}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default LandingPage;