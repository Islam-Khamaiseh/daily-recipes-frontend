import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../config/firebase";
import "./StarRating.css";

const StarRating = ({ recipeId }) => {
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [ref, setRef] = useState(false);

  const fetchRatings = async () => {
    try {
      let token = null;

      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      const response = await axios.get(
        `http://localhost:5000/api/getRecipeRatings?recipeId=${recipeId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      setUserRating(response.data.userRating);
      setAverageRating(response.data.averageRating);
      setRatingCount(response.data.ratingCount);
    } catch (error) {
      console.error("Error fetching ratings:", error.message);
    }
  };

  const handleStarClick = async (rating) => {
    try {
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        "http://localhost:5000/api/rateRecipe",
        { recipeId, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserRating(rating);
      setTimeout(fetchRatings, 1000);
    } catch (error) {
      console.error("Error rating recipe:", error.message);
    }
  };

  const handleDeleteRating = async () => {
    try {
      const token = await auth.currentUser.getIdToken();

      await axios.delete("http://localhost:5000/api/deleteRating", {
        headers: { Authorization: `Bearer ${token}` },
        data: { recipeId },
      });

      setUserRating(null);
      setTimeout(fetchRatings, 1000);
    } catch (error) {
      console.error("Error deleting rating:", error.message);
    }
  };

  useEffect(() => {
    if (recipeId) {
      setRef(!ref);
      setTimeout(fetchRatings, 1000);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRatings();
  }, [ref]);

  return (
    <div className="ratings">
      <p>
        <span className="ratings-star">★</span> {ratingCount} Ratings (
        {averageRating.toFixed(1)}/5)
      </p>
      <div className="ratings-5stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleStarClick(star)}
            className="ratings-5stars-span"
            style={{
              color: star <= userRating ? "gold" : "gray",
            }}
          >
            ★
          </span>
        ))}
      </div>

      {userRating && (
        <button onClick={handleDeleteRating} className="delete-btn">
          Remove My Rating
        </button>
      )}
    </div>
  );
};

export default StarRating;
