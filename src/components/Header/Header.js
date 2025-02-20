import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo/logo4.svg";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [user] = useAuthState(auth);
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef();
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  const getUserInfo = async () => {
    try {
      if (!auth.currentUser) {
        console.error("User not authenticated");
        return;
      }
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/userInfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowFilters(false);
    }
  };

  const handleToggleDropdown = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setTimeout(getUserInfo, 1000);
      getUserInfo();
    }
  }, [user]);

  return (
    <header className="container-fluid py-2">
      <div className="row align-items-center justify-content-between">
        <div className="col-4 d-flex align-items-center">
          <img
            src={logo}
            alt="Daily Recipes Logo"
            className="header-logo"
            onClick={() => (window.location.href = "/")}
          />
        </div>

        <nav className="col-4 d-none d-md-block">
          <ul className="header-nav">
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/create"
                className={location.pathname === "/create" ? "active" : ""}
              >
                Create
              </Link>
            </li>
            <li>
              <Link
                to="/community"
                className={location.pathname === "/community" ? "active" : ""}
              >
                Explore
              </Link>
            </li>
            <li>
              <Link
                to="/aboutUs"
                className={location.pathname === "/aboutUs" ? "active" : ""}
              >
                About Us
              </Link>
            </li>
          </ul>
        </nav>

        <div className="col-4 text-end">
          {userInfo && user ? (
            <div className="user-name">
              <img
                src={
                  userInfo.avatar ||
                  "https://res.cloudinary.com/diwtb2b9i/image/upload/v1740048991/istockphoto-1223671392-612x612_ltici0.jpg"
                }
                alt="user-image"
                className="user-image"
                onClick={handleToggleDropdown}
              />
              <p className="user-name-text" onClick={handleToggleDropdown}>
                {userInfo.userName || "User"}
              </p>
              {showFilters && (
                <div className="user-name-dropdown" ref={dropdownRef}>
                  <button
                    onClick={() => (window.location.href = "/account/history")}
                  >
                    Recipe History
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = "/account/saved-recipes")
                    }
                  >
                    Saved Recipes
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = "/account/account-details")
                    }
                  >
                    Account Details
                  </button>
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <a href="/login" className="btn-signup">
                Sign Up
              </a>
              <a href="/login" className="btn-login">
                Log In
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
