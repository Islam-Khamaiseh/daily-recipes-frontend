import React, { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import HomePageContant from "../../components/HomePageContant/HomePageContant";
import "./Home.css";

const Home = () => {
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
        <HomePageContant />
      </section>
    </div>
  );
};

export default Home;
