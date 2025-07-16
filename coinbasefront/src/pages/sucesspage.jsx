import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function SucessPage(){
    const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <FaCheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Approved</h1>
      <p className="text-center text-gray-700 max-w-md mb-6">
        Your payment has been successfully processed. We will send you an email with all the details shortly.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
}