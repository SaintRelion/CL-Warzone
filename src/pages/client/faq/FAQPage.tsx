import { useState } from "react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How long does installation take?",
      a: "Installation typically takes 2–3 hours. Our technician will contact you 24 hours before the scheduled time.",
    },
    {
      q: "Can I change my plan later?",
      a: "Yes! You can upgrade or downgrade your plan anytime. Changes will take effect on your next billing cycle.",
    },
    {
      q: "What areas do you serve?",
      a: "We currently serve Metro Manila, Cebu City, Davao City, Baguio City, Iloilo City, and Cagayan de Oro.",
    },
    {
      q: "Is there a contract?",
      a: "We offer flexible month-to-month plans with no long-term contracts required.",
    },
    {
      q: "What is your customer support availability?",
      a: "24/7 customer support is available via phone, email, and live chat.",
    },
  ];

  return (
    <div className="max-w-4xl space-y-10">
      {/* HEADER */}
      <div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
          Support & FAQ
        </h2>
        <p className="text-gray-600">
          Find quick answers to the most common questions
        </p>
      </div>

      {/* FAQ LIST */}
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === i ? null : i)
              }
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.q}
              </h3>

              <span className="text-2xl text-indigo-600">
                {openIndex === i ? "−" : "+"}
              </span>
            </button>

            {openIndex === i && (
              <div className="border-t px-6 pb-6 text-gray-600">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SUPPORT CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-8 text-center shadow-sm">
        <h3 className="mb-2 text-2xl font-bold text-indigo-900">
          Still have questions?
        </h3>
        <p className="mb-6 text-indigo-800">
          Our support team is ready to help you anytime
        </p>

        <button className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow transition hover:bg-indigo-700">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default FAQPage;
