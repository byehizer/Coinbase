import { useState } from "react";
import { useShoppingCart } from "../context/shoppingcartcontext";

export function OrderForm() {
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    address: "",
    city: "",
    country: "",
    payment_method: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const { totalAmount, products } = useShoppingCart();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      total: totalAmount,
      items: products,
    };

    try {
      if (formData.payment_method === "Stripe") {
        // 1. Redirigir a Stripe Checkout
        const res = await fetch("http://localhost:5000/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        window.location.href = data.checkoutUrl;
      } else {
        // 2. Orden para Venmo/Zelle
        const res = await fetch("/api/orders/manual", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        alert("Order created! Check your email to upload the receipt.");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Something went wrong");
    }
  };

  return (
        <div className="flex min-h-[calc(100vh-200px)] justify-center items-center">
            <div className="container mx-auto max-w-xl shadow-md dark:shadow-white py-4 px-6 sm:px-10 bg-white dark:bg-gray-800 border-emerald-500 rounded-md">
                <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Complete Your Purchase
                </h1>
                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="my-2">
                        <label htmlFor="client_name" className="text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                            type="text"
                            id="client_name"
                            name="client_name"
                            onChange={handleChange}
                            required
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Email */}
                    <div className="my-2">
                        <label htmlFor="client_email" className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            id="client_email"
                            name="client_email"
                            onChange={handleChange}
                            required
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Address */}
                    <div className="my-2">
                        <label htmlFor="address" className="text-sm font-bold text-gray-700 dark:text-gray-300">Shipping Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            onChange={handleChange}
                            required
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* City */}
                    <div className="my-2">
                        <label htmlFor="city" className="text-sm font-bold text-gray-700 dark:text-gray-300">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            onChange={handleChange}
                            required
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Country */}
                    <div className="my-2">
                        <label htmlFor="country" className="text-sm font-bold text-gray-700 dark:text-gray-300">Country</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            onChange={handleChange}
                            required
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="my-4">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Payment Method</p>
                        <div className="space-y-1">
                            {["Venmo", "Zelle", "Stripe"].map((method) => (
                                <label key={method} className="flex items-center gap-2 text-gray-700 dark:text-white text-sm">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value={method}
                                        required
                                        onChange={handleChange}
                                    />
                                    {method}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="my-4 text-center">
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">Order Total:</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalAmount}</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-2 bg-emerald-500 rounded-md text-black text-md shadow-md hover:bg-emerald-600"
                    >
                        {formData.payment_method === "Stripe"
                            ? "Proceed to Stripe"
                            : "Start Order"}
                    </button>

                    {/* Message for Venmo/Zelle */}
                    {(formData.payment_method === "Venmo" || formData.payment_method === "Zelle") && (
                        <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold text-center">
                            After submitting, you’ll receive an order code and a link by email to upload your payment receipt.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
