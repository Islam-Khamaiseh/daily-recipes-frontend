import { useEffect, useState } from "react";
import axios from "axios";
import MiniRecipeCard from "../../components/MiniRecipeCard/MiniRecipeCard";
import "./CommunityRecipes.css";

const CommunityRecipes = () => {
  const [ids, setIDs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 20;

  const fetchRecipeIDs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/recipesIds`
      );
      setIDs(response.data.ids);
    } catch (error) {
      console.error("Error fetching recipe IDs:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchRecipeIDs();
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/search`,
        {
          params: { ingredients: searchQuery },
        }
      );

      setIDs(response.data.recipeIds);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipeIDs();
  }, []);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = ids.slice(indexOfFirstRecipe, indexOfLastRecipe);

  return (
    <div className="community-page">
      <div className="community-page-header">
        <h1>All Recipes</h1>
      </div>
      <div className="community-page-body">
        <div className="community-page-filters">
          <div className="community-page-filters-box">
            {/* Search Bar */}
            <input
              className="community-page-filters-box-input"
              type="text"
              placeholder="Enter ingredients (rice, chicken, ...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="community-page-filters-box-button"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {/* Display Recipes */}
        <div className="community-page-cards">
          {currentRecipes.map((recipe, index) => (
            <MiniRecipeCard key={index} recipeId={recipe} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-buttons">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Back
          </button>
          <span>
            Page {currentPage} of {Math.ceil(ids.length / recipesPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastRecipe >= ids.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityRecipes;
