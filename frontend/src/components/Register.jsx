import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Register.css';
import Loading from "./Loading.jsx";
import { register } from "../actions/UserActions.jsx";
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
    <section className="vh-100 bg-image" style={{ backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')" }}>
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          {loading && <Loading />}
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-6 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mt-4 mb-4">Create an account</h2>

                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-2">
                      <input
                        type="text"
                        id="form3Example1cg"
                        className="form-control form-control-lg"
                        placeholder="Your Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div className="form-outline mb-2">
                      <input
                        type="email"
                        id="form3Example3cg"
                        className="form-control form-control-lg"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-outline mb-2">
                      <input
                        type="password"
                        id="form3Example4cg"
                        className="form-control form-control-lg"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="form-outline mb-2">
                      <input
                        type="password"
                        id="form3Example4cdg"
                        className="form-control form-control-lg"
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <div className="form-check d-flex justify-content-center mt-4 mb-3">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        value={agreeTerms}
                        id="form2Example3cg"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="form2Example3cg">
                        I agree to all statements in <a href="#!" className="text-body"><u>Terms of service</u></a>
                      </label>
                    </div>

                    <div className="d-flex justify-content-center">
                      <button type="submit" className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">
                        Register
                      </button>
                    </div>

                    <p className="text-center text-muted mt-4 mb-0">
                      Already have an account? <a href="/login" className="fw-bold text-body"><u>Login here</u></a>
                    </p>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
