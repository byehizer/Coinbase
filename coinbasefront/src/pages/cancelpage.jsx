import React, { useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <FaTimesCircle className="text-red-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Cancelled</h1>
      <p className="text-center text-gray-700 max-w-md mb-6">
        Your payment was not completed. You can try again or contact us if you need help.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
      >
        Return to Home
      </button>
    </div>
  );
}
