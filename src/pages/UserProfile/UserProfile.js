import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MiniRecipeCard from "../../components/MiniRecipeCard/MiniRecipeCard";
import "./UserProfile.css";

const UserProfile = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/getUserProfile/${userId}`
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  if (isLoading) return <p>Loading profile...</p>;
  if (!userInfo) return <p>User profile not found</p>;

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = userInfo.historyRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  return (
    <div className="account">
      <div className="account-header">
        <h1>{userInfo.userName || "User"} Profile</h1>
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
              className="user-image"
            />
            <h1>{userInfo.userName || "User"}</h1>
            <h3>Member Since</h3>
            <p>{userInfo.createdAt}</p>
            <h3>Created Recipes</h3>
            <p>{userInfo.historyRecipes.length}</p>
            <h3>Saved Recipes</h3>
            <p>{userInfo.savedRecipes.length}</p>
          </div>
        </div>
        <div className="account-body-content">
          {userInfo.historyRecipes && (
            <div>
              <div className="recipe-grid">
                {currentRecipes.map((recipe, index) => (
                  <MiniRecipeCard key={index} recipeId={recipe} />
                ))}
              </div>

              <div className="pagination-buttons">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Back
                </button>
                <span>
                  Page {currentPage} of{" "}
                  {Math.ceil(userInfo.historyRecipes.length / recipesPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={indexOfLastRecipe >= userInfo.historyRecipes.length}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
