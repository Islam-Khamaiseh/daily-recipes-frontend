import React, { useEffect } from "react";
import LoginSignupForm from "../../components/LoginSignupForm/LoginSignupForm";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebase";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/Home");
    }
  }, [user, navigate]);

  return (
    <div className="login-page">
      <div className="login-page-image">
        <div className="login-page-image-text">
          <h1>Get Everything You Want</h1>
          <p>
            You can get everything you want if you work hard, trust the process,
            and stick to the plan.
          </p>
        </div>
      </div>
      <div className=" login-page-form">
        <LoginSignupForm />
      </div>
    </div>
  );
};

export default LoginSignup;
