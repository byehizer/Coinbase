import { useState } from "react";
import { useShoppingCart } from "../context/shoppingcartcontext";

export function OrderForm() {
    const [paymentMethod, setPaymentMethod] = useState("");
    const { totalAmount } = useShoppingCart();

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    return (
        <div className="flex min-h-[calc(100vh-200px)] justify-center items-center">
            <div className="container mx-auto max-w-xl shadow-md dark:shadow-white py-4 px-6 sm:px-10 bg-white dark:bg-gray-800 border-emerald-500 rounded-md">
                <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Complete Your Purchase
                </h1>
                <form action="" method="POST">
                    {/* Full Name */}
                    <div className="my-2">
                        <label htmlFor="client_name" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="client_name"
                            name="client_name"
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="my-2">
                        <label htmlFor="client_email" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="client_email"
                            name="client_email"
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="my-2">
                        <label htmlFor="address" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            Shipping Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    {/* City */}
                    <div className="my-2">
                        <label htmlFor="city" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    {/* Country */}
                    <div className="my-2">
                        <label htmlFor="country" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            Country
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            className="block w-full border border-emerald-500 outline-emerald-800 px-2 py-2 text-sm rounded-md my-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="my-4">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Payment Method</p>
                        <div className="space-y-1">
                            {["PayPal", "Venmo", "Zelle", "Card", "Crypto"].map((method) => (
                                <label key={method} className="flex items-center gap-2 text-gray-700 dark:text-white text-sm">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value={method}
                                        required
                                        onChange={handlePaymentChange}
                                    />
                                    {method}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="my-4 text-center">
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            Order Total:
                        </p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            ${totalAmount} {/* Replace with dynamic value */}
                        </p>
                    </div>

                    {/* Dynamic Button */}
                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-2 bg-emerald-500 rounded-md text-black text-md shadow-md hover:bg-emerald-600"
                    >
                        {paymentMethod === "Venmo" || paymentMethod === "Zelle"
                            ? "Start Order"
                            : "Proceed to Payment"}
                    </button>

                    {/* Conditional Message */}
                    {(paymentMethod === "Venmo" || paymentMethod === "Zelle") && (
                        <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold text-center">
                            Please save the order code that will be shown after starting the order. You will need it to upload your payment receipt using the link sent to your email.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
