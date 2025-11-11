import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SuccessfulPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Application Submitted Successfully!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for submitting your application. We’ll review your details
          and get back to you soon.
        </p>

         
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-200"
        >
          Back to Home
        </button> 
      </div>
    </div>
  );
}

export default SuccessfulPage;
