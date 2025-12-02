const FAQPage = () => {
  return (
    <div>
      <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
        Support & FAQ
      </h2>
      <p className="mb-8 text-gray-600">Find answers to common questions</p>

      <div className="space-y-4">
        {[
          {
            q: "How long does installation take?",
            a: "Installation typically takes 2-3 hours. Our technician will contact you 24 hours before the scheduled time.",
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
            a: "24/7 customer support available via phone, email, and live chat for all customers.",
          },
        ].map((faq, i) => (
          <div key={i} className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-bold text-gray-900">{faq.q}</h3>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-indigo-50 p-6 text-center md:p-8">
        <h3 className="mb-2 text-2xl font-bold text-indigo-900">
          Still have questions?
        </h3>
        <p className="mb-4 text-indigo-800">
          Contact our support team for more information
        </p>
        <button className="rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white transition hover:bg-indigo-700">
          Contact Support
        </button>
      </div>
    </div>
  );
};
export default FAQPage;
