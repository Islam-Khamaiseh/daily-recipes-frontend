import React, { useEffect, useState } from "react";
import styles from "./RecipeCard.css";
import saveIcon from "../../assets/images/save.svg";
import savedIcon from "../../assets/images/saved.svg";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../config/firebase";

function RecipeCard({ recipe }) {
  const [recipeList, setrecipeList] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  const handleToggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "ar" : "en"));
  };

  const getRecipe = async (recipeId) => {
    try {
      const params = { recipeId };
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/getRecipe`,
        {
          params,
        }
      );

      const recipes3 = await response.data;
      setrecipeList(recipes3);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
      return [];
    }
  };

  const saveRecipeToHistory = async (recipeId) => {
    try {
      const token = await auth.currentUser.getIdToken();

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/saveRecipeToHistory`,
        { recipeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(
        "Error recipe save in history:",
        error.response?.data || error.message
      );
    }
  };

  const toggleSave = async (recipeId) => {
    try {
      const token = await auth.currentUser.getIdToken();

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/toggleSaveRecipe`,
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

  useEffect(() => {
    if (recipe) {
      getRecipe(recipe);
      setIsSaved(false);
      saveRecipeToHistory(recipe);
    }
  }, [recipe]);

  if (
    !recipeList.title_en ||
    !recipeList.ingredients_en ||
    !recipeList.instructions_en ||
    !recipeList.nutritionalSummary_en
  ) {
    return;
  }

  return (
    <div>
      <div className="container recipe-card-container">
        <div className="row recipe-card-container-buttons">
          <div className="col-6 recipe-card-container-buttons-history">
            <p>
              Recipe Stored in your{" "}
              <span onClick={() => (window.location.href = "/account/history")}>
                Account History
              </span>
            </p>
          </div>
          <div className="col-6 recipe-card-container-buttons-View">
            <img
              src={isSaved ? savedIcon : saveIcon}
              onClick={() => toggleSave(recipe)}
              alt="save"
            />
            <button
              onClick={() => navigate(`/recipe/${recipe}`)}
              className="button-view"
            >
              View Full Recipe
            </button>
            <button onClick={handleToggleLanguage} className="button-language">
              {language === "en" ? "Switch to Arabic" : "Switch to English"}
            </button>
          </div>
        </div>
        {language === "en" ? (
          <div>
            <div className="row recipe-card-container-title">
              <div className="col-12 ">
                <h1>{recipeList.title_en}</h1>
              </div>
            </div>
            <div className="row recipe-card-container-servings">
              <div className="col-12 recipe-card-container-servings">
                <p>Servings: {recipeList.servings_en}</p>
              </div>
            </div>
            <div className="row recipe-card-container-body">
              <div className="col-6 recipe-card-container-body-ingredients">
                <h4>Ingredients</h4>
                <ul>
                  {recipeList.ingredients_en.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="col-6 recipe-card-container-body-steps">
                <h4>Steps</h4>
                <ul>
                  {recipeList.instructions_en.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="row recipe-card-container-nutritional">
              <div className="col-12 recipe-card-container-nutritional-text">
                <h4>Nutritional Summary</h4>
                <ul>
                  {recipeList.nutritionalSummary_en.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="rtl-mode">
            <div className="row recipe-card-container-title">
              <div className="col-12 ">
                <h1>{recipeList.title_ar}</h1>
              </div>
            </div>
            <div className="row recipe-card-container-servings">
              <div className="col-12 recipe-card-container-servings">
                <p>عدد الحصص: {recipeList.servings_en}</p>
              </div>
            </div>
            <div className="row recipe-card-container-body">
              <div className="col-6 recipe-card-container-body-ingredients">
                <h4>المكونات</h4>
                <ul>
                  {recipeList.ingredients_ar.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="col-6 recipe-card-container-body-steps">
                <h4>الخطوات</h4>
                <ul>
                  {recipeList.instructions_ar.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="row recipe-card-container-nutritional">
              <div className="col-12 recipe-card-container-nutritional-text">
                <h4>ملخص القيم الغذائية</h4>
                <ul>
                  {recipeList.nutritionalSummary_ar.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="row recipe-card-container-note">
          <div className="col-12 recipe-card-container-note-text">
            <p>
              <span> NOTE:</span> This recipe is AI-generated and Daily Recipes
              has not verified it for accuracy or safety. It may contain errors.
              Always use your best judgement when making AI-generated dishes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
