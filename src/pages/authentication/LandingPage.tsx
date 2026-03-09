// src/pages/LandingPage.tsx

import { useState } from "react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { Plan } from "@/models/Plan";
import LoginModal from "./LoginPage";

const LandingPage = () => {  // const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);


  const { useList: getPlans } = useResourceLocked<Plan>("plan", {
    showToast: false,
  });

  const { data: plans = [], isLoading, isError } = getPlans();

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
      <div className="min-h-screen bg-white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 px-4 py-20">

        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70">

          <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">

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
        <section className="mx-auto mt-10 max-w-3xl text-center pb-16">

          <h1 className="mb-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
            Reliable Fiber Internet
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Warzone Fiber delivers fast, low-latency internet with a
            modern billing system designed for seamless connectivity.
          </p>

        </section>

        {/* DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700 my-16"></div>

        {/* WHY CHOOSE */}
        <section className="max-w-5xl mx-auto">

          <h2 className="text-center text-3xl font-bold text-red-500 dark:text-amber-400 mb-12">
            Why Choose Warzone?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

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
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition hover:shadow-lg hover:shadow-red-400/10"
              >

                <h3 className="font-semibold text-lg mb-2">
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
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700 my-16"></div>

        {/* PLANS */}
        <section className="max-w-4xl mx-auto">

          {isLoading && (
            <p className="text-center text-zinc-500">Loading plans...</p>
          )}

          {isError && (
            <p className="text-center text-red-500">Failed to load plans</p>
          )}

          {!isLoading && !isError && (

            <div className="grid md:grid-cols-2 gap-8">

              {plans.map((plan) => {

                const featured = plan.name === "Pro Fiber";

                return (

                  <div
                    key={plan.id}
                    className={`rounded-2xl p-8 transition hover:scale-[1.02] ${
                      featured
                        ? "bg-red-500 text-white shadow-xl shadow-red-500/20 dark:bg-amber-400 dark:text-black"
                        : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    }`}
                  >

                    <h3 className="text-lg font-semibold mb-4">
                      {plan.name}
                    </h3>

                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold">
                        ₱{plan.price}
                      </span>
                      <span className="ml-2 text-sm opacity-70">
                        /month
                      </span>
                    </div>

                    <p className="text-sm mb-8 opacity-80">
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
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700 my-16"></div>

        {/* BUSINESS */}
        <section className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <h2 className="text-3xl font-bold text-red-500 dark:text-amber-400">
              Expanding Beyond Home Internet
            </h2>

            <p className="text-zinc-600 dark:text-zinc-400 mt-4">
              Warzone Fiber also supports businesses and institutions with
              enterprise-grade connectivity.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              "Business Fiber",
              "Cloud Hosting",
              "Network Infrastructure",
            ].map((title, i) => (

              <div
                key={i}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 hover:border-red-500 transition"
              >

                <h3 className="font-semibold mb-3">
                  {title}
                </h3>

                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Reliable infrastructure services built for modern businesses.
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700 my-16"></div>

        {/* INDUSTRIES */}
        <section className="text-center max-w-5xl mx-auto">

          <h2 className="text-3xl font-bold text-red-500 dark:text-amber-400 mb-8">
            Powering Communities
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-sm">

            {[
              "🎮 Gaming Cafés",
              "🏫 Schools",
              "🏢 Offices",
              "🏬 Retail Stores",
            ].map((item, i) => (

              <div
                key={i}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6"
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