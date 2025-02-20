import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import saveIcon from "../../assets/images/save.svg";
import savedIcon from "../../assets/images/saved.svg";
import star from "../../assets/icon/star_rate.svg";
import { auth } from "../../config/firebase";
import "./MiniRecipeCard.css";

function MiniRecipeCard({ recipeId }) {
  const [recipeList, setRecipeList] = useState(null);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const getRecipe = async (recipeId) => {
    try {
      const params = { recipeId };
      const response = await axios.get("http://localhost:5000/api/getRecipe", {
        params,
      });

      const recipes3 = await response.data;
      setRecipeList(recipes3);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
      return [];
    }
  };

  const toggleSave = async (recipeId) => {
    try {
      const token = await auth.currentUser.getIdToken();

      const response = await axios.post(
        "http://localhost:5000/api/toggleSaveRecipe",
        { recipeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { action } = response.data;

      if (
        (action === "saved" && !isSaved) ||
        (action === "removed" && isSaved)
      ) {
        setIsSaved(action === "saved");
      }
    } catch (error) {
      console.error(
        "Error toggling recipe save:",
        error.response?.data || error.message
      );
    }
  };

  // const checkIfSaved = async (recipeId) => {
  //   try {
  //     const token = await auth.currentUser.getIdToken();

  //     const response = await axios.get(
  //       "http://localhost:5000/api/checkIfSaved",
  //       {
  //         params: { recipeId },
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const { isSaved } = response.data;
  //
  //     setIsSaved(isSaved);
  //   } catch (error) {
  //     console.error(
  //       "Error checking if recipe is saved:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  useEffect(() => {
    getRecipe(recipeId);
  }, [recipeId]);

  if (!recipeList) {
    return;
  }

  return (
    <div className="recipe-card">
      <img
        src={isSaved ? savedIcon : saveIcon}
        onClick={() => toggleSave(recipeId)}
        alt="save"
        className="recipe-card__save-icon"
      />
      <img
        src={
          recipeList.imageURL ||
          "https://res.cloudinary.com/diwtb2b9i/image/upload/v1737020097/recipes/k9dr9vrkghldfmmruws9.jpg"
        }
        alt={recipeList.title_en}
        className="recipe-card__image"
        onClick={() => navigate(`/recipe/${recipeId}`)}
      />
      <div className="recipe-card__content">
        <div className="recipe-card__content-line1">
          <p className="recipe-card__date">{recipeList.createdAt}</p>
          <p className="recipe-card__date">
            <img className="recipe-card-star" src={star} alt="star" />
            {recipeList.ratings.average.toFixed(1)} ({recipeList.ratings.count}{" "}
            Review)
          </p>
        </div>

        <div className="recipe-card__content-line2">
          <h3
            className="recipe-card__title"
            onClick={() => navigate(`/recipe/${recipeId}`)}
          >
            {recipeList.title_en}
          </h3>
          <p
            className="recipe-card__owner"
            onClick={() => navigate(`/user/${recipeList.owner}`)}
          >
            {recipeList.ownerName}
          </p>
        </div>

        <button className="recipe-card__bookmark">
          <i className="bookmark-icon"></i>
        </button>
      </div>
    </div>
  );
}

export default MiniRecipeCard;
