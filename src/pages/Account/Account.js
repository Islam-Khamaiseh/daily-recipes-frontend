import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { auth } from "../../config/firebase";
import saveOff from "../../assets/images/save-off.svg";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import "./Account.css";

function Account() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getUserInfo = async () => {
    try {
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

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (!userInfo) {
    return;
  }

  return (
    <div className="account">
      <div className="account-header">
        <h1 className="account-header-h1">My Account</h1>
      </div>
      <div className="account-body">
        <div className="account-body-list">
          <div className="account-body-list-content">
            <img
              src={
                userInfo.avatar ||
                "https://res.cloudinary.com/diwtb2b9i/image/upload/v1740048991/istockphoto-1223671392-612x612_ltici0.jpg"
              }
              alt="user-image"
              className="user_image"
            />
            <h1 className="user-name">{userInfo.userName || "User"}</h1>

            <div className="account-body-list-content-buttons">
              <button
                onClick={() => navigate("/account/history")}
                className={
                  location.pathname.includes("/account/history") ? "active" : ""
                }
              >
                <img src={saveOff} alt="save icon" /> Recipe History
              </button>

              <button
                onClick={() => navigate("/account/saved-recipes")}
                className={
                  location.pathname.includes("/account/saved-recipes")
                    ? "active"
                    : ""
                }
              >
                <img src={saveOff} alt="save icon" /> Saved Recipes
              </button>

              <button
                onClick={() => navigate("/account/account-details")}
                className={
                  location.pathname.includes("/account/account-details")
                    ? "active"
                    : ""
                }
              >
                <img src={saveOff} alt="save icon" /> Account Details
              </button>

              <button onClick={logout} className="logout">
                <img src={saveOff} alt="save icon" /> Logout
              </button>
            </div>
          </div>
        </div>
        <div className="account-body-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Account;
