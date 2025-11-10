import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Header from "./Header";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    
    setTimeout(() => {
      setLoading(false);
      if (username === "admin" && password === "admin123") {
        alert("Login successful!");
        // redirect to dashboard, e.g. navigate("/dashboard")
      } else {
        setError("Invalid username or password");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
    
      <Header
        isLoggedIn={false}
        isLoginPage={true}
        username=""
        userRole="USER"
        handleLogout={() => {}}
        handleApplicationsClick={() => {}}
        handleViewOfficers={() => {}}
      />

      
      <div className="flex-1 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl space-y-8" // Increased size and padding
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Login</h1> {/* Larger heading */}

          
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg py-4 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" // Increased padding and text size
            />
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" /> {/* Larger icon */}
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
            className="w-full bg-gray-500 hover:bg-gray-200 text-white font-semibold py-4 rounded-full transition duration-200 text-lg" 
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="text-blue-400 hover:text-blue-400 font-semibold underline transition duration-200"
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
    </div>
  );
};

export default LoginPage;