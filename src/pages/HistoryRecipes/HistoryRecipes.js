import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../config/firebase";
import MiniRecipeCard from "../../components/MiniRecipeCard/MiniRecipeCard";
import "./HistoryRecipes.css";

const HistoryRecipes = () => {
  const [recipeList, setRecipeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;

  const getRecipesInHistory = async (userId) => {
    try {
      const params = { userId };

      const response = await axios.get(
        "http://localhost:5000/api/getRecipesInHistory",
        {
          params,
        }
      );

      setRecipeList(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
    }
  };

  useEffect(() => {
    getRecipesInHistory(auth.currentUser.uid);
  }, []);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipeList.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  return (
    <div className="history-page">
      <div className="history-page-cards">
        {currentRecipes.length > 0 ? (
          currentRecipes.map((recipe, index) => (
            <MiniRecipeCard key={index} recipeId={recipe} />
          ))
        ) : (
          <p>No recipes in history.</p>
        )}
      </div>

      <div className="pagination-buttons">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Back
        </button>
        <span>
          Page {currentPage} of {Math.ceil(recipeList.length / recipesPerPage)}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastRecipe >= recipeList.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoryRecipes;
