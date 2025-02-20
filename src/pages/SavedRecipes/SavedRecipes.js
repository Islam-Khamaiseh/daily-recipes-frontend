import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../config/firebase";
import MiniRecipeCard from "../../components/MiniRecipeCard/MiniRecipeCard";
import "./SavedRecipes.css";

const SavedRecipes = () => {
  const [recipeList, setRecipeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;
  const [refresh, setRefresh] = useState(true);

  const getSavedRecipes = async (userId) => {
    try {
      const params = { userId };

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/getSavedRecipes`,
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
    getSavedRecipes(auth.currentUser.uid);
  }, [refresh]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipeList.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  return (
    <div className="saved-page">
      <div className="saved-page-cards">
        {currentRecipes.length > 0 ? (
          currentRecipes.map((recipe, index) => (
            <MiniRecipeCard key={index} recipeId={recipe} />
          ))
        ) : (
          <p>No saved recipes.</p>
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

export default SavedRecipes;
