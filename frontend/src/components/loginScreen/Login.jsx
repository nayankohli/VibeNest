import { useNavigate } from 'react-router-dom'; 
import './Login.css'; // Import your CSS file
import React, { useEffect, useState } from 'react';
import Loading from "../Loading.jsx";
import { Link } from "react-router-dom";
import { login } from "../../actions/UserActions.jsx";
import { useDispatch, useSelector } from "react-redux";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, userInfo } = userLogin;

    useEffect(() => {
        if(userInfo){
            navigate("/home");
        }
    }, [navigate,userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <section className="vh-100 bg-image" style={{ backgroundImage: "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')" }}>
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                <div className="container h-100">
                {loading&&<Loading/>}
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="card" style={{ borderRadius: "15px" }}>
                                <div className="card-body p-5">
                                    <h2 className="text-uppercase text-center mb-4">Login</h2>
                                    <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start mt-4 mb-4">
                                        <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-floating mx-1 gradient-custom-4 text-body">
                                            <i className="fab fa-facebook-f" style={{color:"#fff"}}></i>
                                        </button>
                                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-floating mx-1 gradient-custom-5 text-body">
                                            <i className="fab fa-twitter" style={{color:"#fff"}}></i>
                                        </button>
                                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-floating mx-1 gradient-custom-6 text-body">
                                            <i className="fab fa-linkedin-in" style={{color:"#fff"}}></i>
                                        </button>
                                    </div>
                                    <div className="divider d-flex align-items-center my-4">
                                        <p className="text-center fw-bold mx-3 mb-0">Or</p>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-outline mb-3">
                                            <input
                                                type="email"
                                                id="form3Example3cg"
                                                className="form-control form-control-lg"
                                                placeholder="Your Email"
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-outline mb-3">
                                            <input
                                                type="password"
                                                id="form3Example4cg"
                                                className="form-control form-control-lg"
                                                placeholder="Password"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                                            <div className="form-check mb-0">
                                                <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                                <label className="form-check-label" htmlFor="form2Example3">Remember me</label>
                                            </div>
                                            <a href="#!" className="text-body">Forgot password?</a>
                                        </div>
                                        <div className="d-flex justify-content-center mb-4">
                                            <button type="submit" className="btn btn-success btn-block btn-lg gradient-custom-2 text-body">
                                                Login
                                            </button>
                                        </div>
                                        <p className="text-center text-muted mt-2 mb-0">
                                            Don't have an account? <Link to="/register" className="fw-bold text-body"><u>Register</u></Link>
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

export default Login;
