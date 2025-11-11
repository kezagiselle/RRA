import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import rra from "../imgs/rra.png";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    
    setTimeout(() => {
      setLoading(false);
      if (username === "admin" && password === "admin123") {
        alert("Login successful!");
      } else {
        setError("Invalid username or password");
      }
    }, 1000);
  };

  const handleSignUpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/applicant");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl space-y-4 sm:space-y-5 lg:space-y-6" 
      >
      
        <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
          <img 
            src={rra} 
            alt="RRA Logo" 
            className="h-20 sm:h-24 lg:h-28 xl:h-32 object-contain" 
          />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg py-3 sm:py-3 lg:py-4 px-3 sm:px-4 pl-10 sm:pl-11 lg:pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base lg:text-lg"
          />
          <FaUser className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg py-3 sm:py-3 lg:py-4 px-3 sm:px-4 pl-10 sm:pl-11 lg:pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base lg:text-lg" 
          />
          <FaLock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-3 lg:py-4 rounded-full transition duration-200 text-sm sm:text-base lg:text-lg" 
        >
          {loading ? "Logging in..." : "Login"}
        </button>

    
        <div className="text-center pt-3 sm:pt-4">
          <p className="text-gray-600 text-sm sm:text-base">
            Don't have an account?{" "}
            <a 
              href="/signup" 
              onClick={handleSignUpClick}
              className="text-blue-400 hover:text-blue-600 font-semibold underline transition duration-200 text-sm sm:text-base"
            >
              Sign up here
            </a>
          </p>
        </div>

    
        {error && (
          <p className="text-red-500 text-xs sm:text-sm lg:text-base text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;