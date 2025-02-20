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
        <div className="how-it-works">
          <h1 className="how-it-works-h1">How It Works</h1>

          <h2 className="how-it-works-h2">1. Select Your Filters</h2>
          <p className="how-it-works-p">
            Choose any dietary preferences or cooking styles (e.g., vegetarian,
            quick & easy, gluten-free) to personalize your recipe.
          </p>

          <h2 className="how-it-works-h2">2. Enter Your Ingredients</h2>
          <p className="how-it-works-p">
            List the ingredients you have on hand—just separate them with commas
            for easy input.
          </p>

          <h2 className="how-it-works-h2">3. Generate Your Recipe</h2>
          <p className="how-it-works-p">
            Click Generate and let our AI create a tailored recipe just for you.
            In seconds, you’ll get a delicious dish idea complete with steps,
            ingredients, and helpful tips.
          </p>

          <h2 className="how-it-works-h2">4. Cook & Enjoy</h2>
          <p className="how-it-works-p">
            Follow the instructions and savor your meal. Feel free to tweak the
            recipe to suit your taste—after all, creativity in the kitchen is
            part of the fun!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Create;
