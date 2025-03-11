import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Loading from "../Loading.jsx";
import { Link } from "react-router-dom";
import { login } from "../../actions/UserActions.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, userInfo, error } = userLogin;

  // ✅ Show toast when userInfo is available (Login successful)
  useEffect(() => {
    if (userInfo) {
      toast.success("🎉 Login Successful!", {
        style: {
          background: "linear-gradient(135deg, #16a34a, #15803d)", // Gradient green
          color: "white",
          fontWeight: "bold",
          padding: "14px 20px",
          boxShadow: "0px 6px 15px rgba(22, 163, 74, 0.3)", // Smooth shadow
          borderRadius: "12px",
          border: "2px solid #38bdf8", // Light blue border
          textAlign: "center",
          letterSpacing: "0.5px",
          transition: "transform 0.3s ease-in-out", // Smooth animation
        },
        position: "bottom-right",
        duration: 3000,
      });
      
      navigate("/home");
    }
  }, [userInfo, navigate]);

  // ✅ Show error toast if login fails
  useEffect(() => {
    if (error) {
      toast.error("❌ Login Failed! Check your credentials.", {
        className:
          "bg-red-600 text-white font-semibold px-4 py-3 shadow-lg rounded-lg border-2 border-red-400",
        position: "bottom-center",
        duration: 3000,
      });
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password)); // Toast now happens *after* successful login
  };

  return (
    <section className="min-h-screen bg-green-100 flex items-center justify-center lg:py-12">
      <div className="w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-lg p-8 mx-4">
        {loading && <Loading />}
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Login
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
