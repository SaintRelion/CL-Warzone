import { useState } from "react";
import { Facebook, Ticket, ChevronDown, ChevronUp } from "lucide-react";
import { serviceAreas } from "@/constants";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can I change my plan later?",
      a: "Yes! You can upgrade or downgrade your plan anytime. Changes will take effect on your next billing cycle.",
    },
    {
      q: "What areas do you serve?",
      a: (
        <div className="space-y-3">
          <p>
            We currently provide high-speed fiber connection to the following
            areas:
          </p>
          <div className="flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <span
                key={area}
                className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-[10px] font-bold tracking-wider text-indigo-700 uppercase"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      q: "Is there a contract?",
      a: "No long-term commitments. We only offer flexible monthly plans to keep our service simple and accessible.",
    },
    {
      q: "What is your customer support availability?",
      a: "Customer support is handled via our internal ticket system and our official Facebook community.",
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* HEADER - Matches your Plans Page */}
      <div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
          Support & FAQ
        </h2>
        <p className="text-gray-600">
          Find quick answers to the most common questions regarding our service.
        </p>
      </div>

      {/* FAQ LIST - Full Width Cards */}
      <div className="grid grid-cols-1 gap-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all hover:shadow-lg"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <h3 className="text-lg font-bold text-gray-900">{faq.q}</h3>
              <span className="text-xl font-bold text-indigo-600">
                {openIndex === i ? <ChevronUp /> : <ChevronDown />}
              </span>
            </button>

            {openIndex === i && (
              <div className="border-t border-gray-50 px-6 py-6 leading-relaxed text-gray-600">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SUPPORT CONTACT SECTION - Lean Design */}
      <div className="mt-12 space-y-6 rounded-xl border border-gray-200 bg-white p-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Still have questions?
          </h3>
          <p className="text-gray-600">
            Reach out to our team directly through our official channels.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* EXTERNAL LINK: FACEBOOK */}
          <a
            href="https://www.facebook.com/share/18KC6xTkrZ/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 rounded-lg bg-[#1877F2] py-4 font-bold text-white transition hover:bg-blue-700"
          >
            <Facebook size={20} />
            Facebook Support
          </a>

          {/* INTERNAL LINK: SUPPORT TICKET */}
          <Link
            to="/support"
            className="flex items-center justify-center gap-3 rounded-lg bg-indigo-600 py-4 font-bold text-white transition hover:bg-indigo-700"
          >
            <Ticket size={20} />
            Open Support Ticket
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
