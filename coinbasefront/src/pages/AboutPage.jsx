import { useState } from "react";
import { faqs } from "../data/faqs";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white bg-gray-800 mt-4 mb-4">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Coinbase Numismatics
        </h1>
        <p className="text-lg text-gray-300">
          Preserving history, one coin at a time.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-white">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Authentic historic coins and rare banknotes</li>
          <li>High-resolution images and detailed descriptions</li>
          <li>Secure checkout and multiple payment methods</li>
          <li>Worldwide shipping with tracking</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-white">Payment & Shipping</h2>
        <p className="text-gray-300 mb-4">
          We accept Credit/Debit Cards, PayPal, Stripe, Venmo, Zelle, Apple Pay,
          Google Pay, and Cryptocurrencies. Orders are usually processed within
          3–5 business days and shipped globally with tracking.
        </p>
        <p className="text-gray-400 italic">
          * For Venmo and Zelle payments, you'll be required to upload a receipt.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">FAQs</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-600 rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 font-medium text-white transition-colors"
              >
                {faq.question}
              </button>
              <div
                className={`transition-all duration-300 ease-in-out bg-gray-800 text-gray-300 px-4 overflow-hidden ${
                  openIndex === index ? 'max-h-96 py-4 border-t border-gray-600' : 'max-h-0'
                }`}
              >
                {openIndex === index && <p>{faq.answer}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 text-center">
        <p className="text-gray-300 mb-2">Still have questions?</p>
        <button
          onClick={() => navigate("/contact")}
          className="bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-200 font-semibold"
        >
          Contact us
        </button>
      </section>
    </div>
  );
}