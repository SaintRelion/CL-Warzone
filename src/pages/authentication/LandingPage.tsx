// src/pages/LandingPage.tsx

import { useState } from "react";
import {
  useResourceLocked,
  type Paginated,
} from "@saintrelion/data-access-layer";
import type { Plan } from "@/models/Plan";
import LoginModal from "./LoginPage";

const LandingPage = () => {
  // const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { useList: getPlans } = useResourceLocked<
    Paginated<Plan>,
    never,
    never
  >("plan", {
    showToast: false,
  });

  const { data: plans, isLoading, isError } = getPlans();

  /* =========================
     THEME SYSTEM
  ========================= */

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme");

  //   if (savedTheme === "dark") {
  //     document.documentElement.classList.add("dark");
  //     setDarkMode(true);
  //   }
  // }, []);

  // const toggleTheme = () => {
  //   if (darkMode) {
  //     document.documentElement.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //     setDarkMode(false);
  //   } else {
  //     document.documentElement.classList.add("dark");
  //     localStorage.setItem("theme", "dark");
  //     setDarkMode(true);
  //   }
  // };

  return (
    <>
      <div className="min-h-screen bg-white px-4 py-20 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
        {/* NAVBAR */}
        <nav className="fixed top-0 right-0 left-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <img
                src="/my-logo.png"
                alt="Warzone Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-bold tracking-wide uppercase">
                WARZONE NET CAFE
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* 
              <button
                onClick={toggleTheme}
                className="rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {darkMode ? "☀️" : "🌙"}
              </button> */}

              <button
                onClick={() => setShowLoginModal(true)}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 dark:bg-amber-400 dark:text-black"
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="mx-auto mt-10 max-w-3xl pb-16 text-center">
          <h1 className="mb-6 bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Reliable Fiber Internet
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Warzone Fiber delivers fast, low-latency internet with a modern
            billing system designed for seamless connectivity.
          </p>
        </section>

        {/* DIVIDER */}
        <div className="my-16 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700"></div>

        {/* WHY CHOOSE */}
        <section className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-red-500 dark:text-amber-400">
            Why Choose Warzone?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Blazing Fast Speed",
                icon: "⚡",
                desc: "Ultra-fast fiber connection designed for gaming and streaming.",
              },
              {
                title: "Secure Billing",
                icon: "🔒",
                desc: "OTP-secured accounts with transparent billing history.",
              },
              {
                title: "Reliable Coverage",
                icon: "📡",
                desc: "Serving multiple municipalities with stable infrastructure.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-200 bg-white p-6 transition hover:shadow-lg hover:shadow-red-400/10 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <h3 className="mb-2 text-lg font-semibold">
                  {item.icon} {item.title}
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DIVIDER */}
        <div className="my-16 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700"></div>

        {/* PLANS */}
        <section className="mx-auto max-w-4xl">
          {isLoading && (
            <p className="text-center text-zinc-500">Loading plans...</p>
          )}

          {isError && (
            <p className="text-center text-red-500">Failed to load plans</p>
          )}

          {!isLoading && !isError && plans && (
            <div className="grid gap-8 md:grid-cols-2">
              {plans.results.map((plan) => {
                const featured = plan.name === "Pro Fiber";

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-8 transition hover:scale-[1.02] ${
                      featured
                        ? "bg-red-500 text-white shadow-xl shadow-red-500/20 dark:bg-amber-400 dark:text-black"
                        : "border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                    }`}
                  >
                    <h3 className="mb-4 text-lg font-semibold">{plan.name}</h3>

                    <div className="mb-4 flex items-baseline">
                      <span className="text-4xl font-bold">₱{plan.price}</span>
                      <span className="ml-2 text-sm opacity-70">/month</span>
                    </div>

                    <p className="mb-8 text-sm opacity-80">
                      {plan.description}
                    </p>

                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={`w-full rounded-lg py-3 font-semibold transition ${
                        featured
                          ? "bg-white text-red-500 hover:bg-zinc-100 dark:bg-black dark:text-white"
                          : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
                      }`}
                    >
                      Apply Now
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* DIVIDER */}
        <div className="my-16 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700"></div>

        {/* BUSINESS */}
        <section className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-red-500 dark:text-amber-400">
              Expanding Beyond Home Internet
            </h2>

            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Warzone Fiber also supports businesses and institutions with
              enterprise-grade connectivity.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {["Business Fiber", "Cloud Hosting", "Network Infrastructure"].map(
              (title, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 bg-white p-8 transition hover:border-red-500 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="mb-3 font-semibold">{title}</h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Reliable infrastructure services built for modern
                    businesses.
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* DIVIDER */}
        <div className="my-16 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700"></div>

        {/* INDUSTRIES */}
        <section className="mx-auto max-w-5xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-red-500 dark:text-amber-400">
            Powering Communities
          </h2>

          <div className="grid gap-6 text-sm md:grid-cols-4">
            {[
              "🎮 Gaming Cafés",
              "🏫 Schools",
              "🏢 Offices",
              "🏬 Retail Stores",
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      {showLoginModal && <LoginModal showLogin={setShowLoginModal} />}
    </>
  );
};

export default LandingPage;
