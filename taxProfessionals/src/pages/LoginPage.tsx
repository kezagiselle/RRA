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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl space-y-6" 
      >
      
        <div className="flex justify-center mb-2">
          <img 
            src={rra} 
            alt="RRA Logo" 
            className="h-32 object-contain" 
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
            className="w-full border border-gray-300 rounded-lg py-4 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          />
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg py-4 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" 
          />
          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-full transition duration-200 text-lg" 
        >
          {loading ? "Logging in..." : "Login"}
        </button>

    
        <div className="text-center pt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a 
              href="/signup" 
              onClick={handleSignUpClick}
              className="text-blue-400 hover:text-blue-600 font-semibold underline transition duration-200"
            >
              Sign up here
            </a>
          </p>
        </div>

    
        {error && (
          <p className="text-red-500 text-base text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;