import React, { useEffect, useState, useRef } from "react";
import { auth } from "../../config/firebase";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [newUserName, setNewUserName] = useState("");

  const getUserInfo = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/userInfo`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data);
      setNewUserName(response.data.userName);
    } catch (error) {
      console.error("Error fetching user info:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleAvatarUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("oldAvatarUrl", userInfo.avatar || "");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/updateAvatar`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserInfo((prev) => ({ ...prev, avatar: response.data.newAvatarUrl }));
    } catch (error) {
      console.error("Error updating avatar:", error.message);
    }
  };

  const handleUserNameUpdate = async () => {
    if (!newUserName || newUserName.trim() === "") {
      alert("Please enter a valid username.");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/updateUserName`,
        { newUserName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserInfo((prev) => ({ ...prev, userName: response.data.userName }));
    } catch (error) {
      console.error("Error updating username:", error.message);
      alert("Failed to update username. Please try again.");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (isLoading) return <p>Loading user information...</p>;

  return (
    <div className="profile-container">
      <h3>Photo Profile</h3>
      <div className="profile-photo">
        <img
          src={
            userInfo.avatar ||
            "https://res.cloudinary.com/diwtb2b9i/image/upload/v1740048991/istockphoto-1223671392-612x612_ltici0.jpg"
          }
          alt="Avatar"
          className="user-image"
        />

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleAvatarUpload}
        />

        <div className="button-group">
          <button onClick={handleFileSelect} className="upload-button">
            Upload new picture
          </button>
        </div>
      </div>

      <h3>Personal Information</h3>
      <div className="profile-inputs">
        <label>User Name</label>
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />

        <label>Email</label>
        <input type="text" value={userInfo?.email || ""} disabled />
      </div>

      <button className="save-profile-button" onClick={handleUserNameUpdate}>
        Save Profile
      </button>
    </div>
  );
};

export default Profile;
