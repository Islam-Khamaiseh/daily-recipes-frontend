import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../config/firebase";
import axios from "axios";
import GoogleLogo from "../../assets/images/flat-color-icons_google.svg";
import "./LoginSignupForm.css";

function LoginSignupForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        if (!username || !email || !password) {
          setError("All fields are required");
          return;
        }
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = result.user;
        const idToken = await user.getIdToken();

        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/saveUser`,
          {
            uid: user.uid,
            userName: username,
            email: user.email,
          },
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        setSuccessMessage("Signup successful!");
        setIsSignUp(false);
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/saveUser`,
        {
          uid: user.uid,
          userName: user.email.split("@")[0],
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className="login">
      <div className="login-contant">
        <h1>Welcome Back</h1>
        <p>Enter your email and password to access your account</p>
      </div>
      <div className="login-form">
        {error && <p className="login-form-error">{error}</p>}
        {successMessage && <p>{successMessage}</p>}
        <form onSubmit={handleSubmit} className="login-form2">
          {isSignUp ? (
            // SignUp
            <div className="login-form-signUp">
              <label for="userName">Name</label>
              <input
                type="text"
                placeholder="Name"
                id="userName"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label for="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label for="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label for="ConfirmPassword">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                id="ConfirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit">Sign Up</button>
            </div>
          ) : (
            // login
            <div className="login-form-login">
              <label for="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label for="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* <p className="forgot-password">Forgot Password</p> */}
              <button type="submit">Sign In</button>
            </div>
          )}
        </form>
        <p className="text-under-form">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
          <div class="divider">
            <span>OR</span>
          </div>
        </p>
        <button onClick={handleGoogleLogin} className="google-login">
          <img src={GoogleLogo} alt="Google Logo" className="google-logo" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginSignupForm;
