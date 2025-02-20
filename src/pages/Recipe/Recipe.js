import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { auth } from "../../config/firebase";
import Comments from "../../components/Comments/Comments";
import StarRating from "../../components/StarRating/StarRating";
import bookmark_off from "../../assets/icon/bookmark_off.svg";
import bookmark_on from "../../assets/icon/bookmark_on.svg";
import MiniRecipeCard from "../../components/MiniRecipeCard/MiniRecipeCard";
import "./Recipe.css";

const Recipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [topRecipes, setTopRecipes] = useState([]);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [language, setLanguage] = useState("en");

  const getRecipe = async (recipeId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/getRecipe`,
        {
          params: { recipeId },
        }
      );
      setRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe:", error.message);
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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setNewImage(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("recipeId", id);
      formData.append("oldImageUrl", recipe?.imageURL);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/updateRecipeImage`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        setRecipe((prev) => ({ ...prev, imageURL: result.newImageUrl }));
      } else {
        throw new Error(result.message || "Failed to update image.");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      alert("Failed to update image. Please try again.");
    }
  };

  const triggerFileInput = () => {
    document.getElementById("hiddenFileInput").click();
  };

  const fetchTopRecipesByRatings = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/topRecipes`
      );

      setTopRecipes(response.data.topRecipes);

      return;
    } catch (error) {
      console.error("Error fetching top recipes by ratings:", error);
      return [];
    }
  };

  const handleCopyLink = () => {
    const pageUrl = window.location.href;
    navigator.clipboard
      .writeText(pageUrl)
      .then(() => {
        setShowCopyMessage(true);

        setTimeout(() => {
          setShowCopyMessage(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Error copying link: ", err);
      });
  };

  const handleToggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "ar" : "en"));
  };

  // const checkIfSaved = async (recipeId) => {
  //   try {
  //     const token = await auth.currentUser.getIdToken();

  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/checkIfSaved`,
  //       {
  //         params: { recipeId },
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const { isSaved } = response.data;

  //     setIsSaved(isSaved);
  //   } catch (error) {
  //     console.error(
  //       "Error checking if recipe is saved:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  useEffect(() => {
    fetchTopRecipesByRatings();
  }, []);

  useEffect(() => {
    if (id) {
      getRecipe(id);
      // checkIfSaved(id);
    }
  }, [id]);

  if (!recipe) {
    return <p className="recipe-not-found">Recipe not found!</p>;
  }

  return (
    <div className="recipe-page">
      <div className="recipe-page-header">
        <h1>{recipe.title_en}</h1>
      </div>
      <div className="recipe-page-recipe">
        <div className="recipe-page-recipe-left">
          <div className="recipe-page-recipe-left-card">
            <div className="recipe-page-recipe-left-card-image">
              <img
                src={
                  recipe.imageURL ||
                  "https://res.cloudinary.com/diwtb2b9i/image/upload/v1737020097/recipes/k9dr9vrkghldfmmruws9.jpg"
                }
                alt="Recipe"
              />
            </div>
            <div className="image-upload">
              <input
                type="file"
                id="hiddenFileInput"
                className="file-input"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <button
              className="recipe-page-recipe-left-card-button"
              onClick={triggerFileInput}
            >
              Upload Image
            </button>

            <h3 className="recipe-page-recipe-left-card-title">
              {recipe.title_en}
            </h3>
            <div className="recipe-page-recipe-left-card-line"></div>
            <div className="recipe-page-recipe-left-card-creator">
              <p className="recipe-page-recipe-left-card-label">Creator</p>
              <p className="recipe-page-recipe-left-card-data">
                {recipe.ownerName}
              </p>
            </div>
            <div className="recipe-page-recipe-left-card-line"></div>
            <div className="recipe-page-recipe-left-card-date">
              <p className="recipe-page-recipe-left-card-label">Date</p>
              <p className="recipe-page-recipe-left-card-data">
                {recipe.createdAt}
              </p>
            </div>
            <div className="recipe-page-recipe-left-card-line"></div>
            <div className="recipe-page-recipe-left-card-servings">
              <p className="recipe-page-recipe-left-card-label">Servings</p>
              <p className="recipe-page-recipe-left-card-data">
                {recipe.servings_en}
              </p>
            </div>
            <div className="recipe-page-recipe-left-card-line"></div>
            <div className="recipe-page-recipe-left-card-bookmarks">
              <p className="recipe-page-recipe-left-card-label">Bookmarks</p>
              <p className="recipe-page-recipe-left-card-data">
                {recipe.savedCounter}
              </p>
            </div>
            <div className="recipe-page-recipe-left-card-line"></div>
            <div className="recipe-page-recipe-left-card-rating">
              <StarRating recipeId={id} />
            </div>

            <div className="recipe-page-recipe-left-card-note">
              <p>
                Note: This recipe is AI-generated and DishGen has not verified
                it for accuracy or safety. Use your best judgement when making
                AI-generated dishes. If you notice an issue,
                <span> please report this recipe.</span>
              </p>
            </div>
          </div>
        </div>
        <div className="recipe-page-recipe-right">
          <div className="recipe-page-recipe-right-card">
            <div className="recipe-page-recipe-right-card-icons">
              <div className="recipe-page-recipe-right-card-icons-social-media">
                {/* Copy Link Button */}
                <button className="copy-link-button" onClick={handleCopyLink}>
                  Copy Link
                </button>
                <p
                  className={`copy-message ${showCopyMessage ? "visible" : ""}`}
                >
                  Link copied!
                </p>
              </div>

              <div className="recipe-page-recipe-right-card-icons-save">
                <button
                  onClick={handleToggleLanguage}
                  className="recipe-page-recipe-right-card-icons-save-language"
                >
                  {language === "en" ? "Switch to Arabic" : "Switch to English"}
                </button>
                <img
                  className="recipe-page-recipe-right-card-icons-bookmark"
                  src={isSaved ? bookmark_on : bookmark_off}
                  onClick={() => toggleSave(id)}
                  alt="save"
                />
              </div>
            </div>

            {language === "en" ? (
              <div>
                <div className="recipe-page-recipe-right-card-ingredients">
                  <h1 className="recipe-page-recipe-right-card-ingredients-title">
                    Ingredients
                  </h1>
                  <div className="recipe-grid-two-columns">
                    {recipe.ingredients_en.map((ingredient, index) => (
                      <div key={index} className="ingredient-item">
                        {ingredient}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recipe-page-recipe-right-card-steps">
                  <h1 className="recipe-page-recipe-right-card-steps-title">
                    Steps
                  </h1>
                  <div className="recipe-steps-list">
                    {recipe.instructions_en.map((step, index) => (
                      <div key={index} className="step-item">
                        <span className="step-number">{index + 1}.</span> {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recipe-page-recipe-right-card-nutritional">
                  <h1 className="recipe-page-recipe-right-card-nutritional-title">
                    Nutritional Summary
                  </h1>
                  <div className="recipe-grid-two-columns">
                    {recipe.nutritionalSummary_en.map((nutritional, index) => (
                      <div key={index} className="nutritional-item">
                        {nutritional}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rtl-mode">
                <div className="recipe-page-recipe-right-card-ingredients">
                  <h1 className="recipe-page-recipe-right-card-ingredients-title">
                    المكونات
                  </h1>
                  <div className="recipe-grid-two-columns">
                    {recipe.ingredients_ar.map((ingredient, index) => (
                      <div key={index} className="ingredient-item">
                        {ingredient}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recipe-page-recipe-right-card-steps">
                  <h1 className="recipe-page-recipe-right-card-steps-title">
                    الخطوات
                  </h1>
                  <div className="recipe-steps-list">
                    {recipe.instructions_ar.map((step, index) => (
                      <div key={index} className="step-item">
                        <span className="step-number">{index + 1}.</span> {step}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recipe-page-recipe-right-card-nutritional">
                  <h1 className="recipe-page-recipe-right-card-nutritional-title">
                    ملخص القيم الغذائية
                  </h1>
                  <div className="recipe-grid-two-columns">
                    {recipe.nutritionalSummary_ar.map((nutritional, index) => (
                      <div key={index} className="nutritional-item">
                        {nutritional}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="recipe-page-line"></div>
      <div className="recipe-page-comments">
        <h1>Comments</h1>

        <Comments recipeId={id} />
      </div>
      <div className="recipe-page-line"></div>
      <div className="recipe-page-top-ratings-recipes">
        <h1>Top Rated Recipes</h1>
        <div className="recipe-page-top-ratings-recipes-cards">
          {topRecipes.map((recipe, index) => (
            <MiniRecipeCard key={index} recipeId={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipe;
