import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from "../Loading.jsx";
import { register } from "../../actions/UserActions.jsx";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false); // Track checkbox state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [userInfo, navigate]);

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      alert('All fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email.');
      return false;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return false;
    }
    if (!agreeTerms) {
      alert('You must agree to the terms and conditions.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        dispatch(register(username, email, password));
        alert('Registered successfully! Please login to your account.');
      } catch (error) {
        console.error(error);
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <section className="min-h-screen bg-green-100 flex items-center justify-center lg:py-12">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-8 mx-4">
        {loading && <Loading />}
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to all statements in <a href="#!" className="text-green-500 underline">Terms of Service</a>
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
            >
              Register
            </button>
          </div>
          <p className="text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-green-500 underline">Login here</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;