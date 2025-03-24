import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import Loading from "../Loading.jsx";
import { Link } from "react-router-dom";
import { login } from "../../actions/UserActions.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ThemeContext } from "../../context/ThemeContext";
import { FaMoon, FaSun, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, userInfo, error } = userLogin;

  // Show toast when userInfo is available (Login successful)
  useEffect(() => {
    if (userInfo) {
      toast.success("🎉 Login Successful!", {
        style: {
          background: isDarkMode 
            ? "" 
            : "black",
          color: isDarkMode 
          ? "black" 
          : "white",
          fontWeight: "bold",
          padding: "14px 20px",
          boxShadow: isDarkMode 
            ? "0px 6px 15px rgba(5, 150, 105, 0.4)" 
            : "0px 6px 15px rgba(22, 163, 74, 0.3)",
          borderRadius: "12px",
          border: isDarkMode 
            ? "2px solid #0ea5e9" 
            : "2px solid #38bdf8",
          textAlign: "center",
          letterSpacing: "0.5px",
          transition: "transform 0.3s ease-in-out",
        },
        position: "bottom-right",
        duration: 3000,
      });
      
      navigate("/home");
    }
  }, [userInfo, navigate, isDarkMode]);

  // Show error toast if login fails
  useEffect(() => {
    if (error) {
      toast.error("❌ Login Failed! Check your credentials.", {
        className: isDarkMode
          ? "bg-red-800 text-white font-semibold px-4 py-3 shadow-lg rounded-lg border-2 border-red-600"
          : "bg-red-600 text-white font-semibold px-4 py-3 shadow-lg rounded-lg border-2 border-red-400",
        position: "bottom-center",
        duration: 3000,
      });
    }
  }, [error, isDarkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(email, password));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <section className={`min-h-screen flex items-center justify-center lg:py-12 transition-colors duration-300 ${
      isDarkMode ? "bg-gray-900" : "bg-green-100"
    }`}>
      <div className={`w-full max-w-md bg-opacity-95 rounded-xl shadow-2xl p-8 mx-4 transition-all duration-300 transform hover:scale-[1.01] ${
        isDarkMode 
          ? "bg-gray-800 text-white border border-gray-700" 
          : "bg-white text-gray-800 border border-gray-100"
      }`}>
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </div>
        
        {loading && <Loading />}
        
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Welcome Back
          </h2>
          <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Please sign in to your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}>
              Email
            </label>
            <div className={`relative rounded-lg overflow-hidden border ${
              isDarkMode ? "border-gray-600 focus-within:border-green-500" : "border-gray-300 focus-within:border-green-400"
            }`}>
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                <FaEnvelope />
              </div>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                className={`w-full p-4 pl-10 focus:outline-none ${
                  isDarkMode 
                    ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500" 
                    : "bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-400"
                }`}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block font-medium mb-2 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}>
              Password
            </label>
            <div className={`relative rounded-lg overflow-hidden border ${
              isDarkMode ? "border-gray-600 focus-within:border-green-500" : "border-gray-300 focus-within:border-green-400"
            }`}>
              <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                <FaLock />
              </div>
              <input
                type="password"
                id="password"
                placeholder="Your Password"
                className={`w-full p-4 pl-10 focus:outline-none ${
                  isDarkMode 
                    ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500" 
                    : "bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-400"
                }`}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className={`h-4 w-4 rounded ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 text-green-500 focus:ring-green-600" 
                    : "bg-gray-100 border-gray-300 text-green-500 focus:ring-green-400"
                }`}
              />
              <label htmlFor="remember" className={`ml-2 block text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Remember me
              </label>
            </div>
            <a href="#" className={`text-sm font-medium ${
              isDarkMode ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-500"
            }`}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
              isDarkMode 
                ? "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800" 
                : "bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            }`}
          >
            Sign In
          </button>

          <p className={`text-center mt-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Don't have an account?{" "}
            <Link to="/register" className={`font-medium ${
              isDarkMode ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-500"
            }`}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;