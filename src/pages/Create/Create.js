import React, { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import "./Create.css";

const Create = () => {
  const [recipes, setRecipes] = useState("");

  const handleSearchResults = (results) => {
    setRecipes(results || "");
  };

  return (
    <div>
      <section>
        <SearchBar onSearchResults={handleSearchResults} />
      </section>
      <section>
        <RecipeCard recipe={recipes} />
      </section>
      <section>
        <div className="how-it-work"></div>
      </section>
    </div>
  );
};

export default Create;
