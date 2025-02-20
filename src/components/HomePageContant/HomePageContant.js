import { useEffect, useState } from "react";
import dish1 from "../../assets/images/dish10.svg";
import dish2 from "../../assets/images/dish2.svg";
import fire from "../../assets/images/fire.svg";
import axios from "axios";
import MiniRecipeCard from "../MiniRecipeCard/MiniRecipeCard";
import "./HomePageContant.css";

function HomePageContant() {
  const [topRecipes, setTopRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);

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

  const fetchRecentRecipes = async () => {
    try {
      const response = await axios.get(
        "https://daily-recipes-backend.onrender.com/api/recentRecipes"
      );

      setRecentRecipes(response.data.recentRecipes);
      return;
    } catch (error) {
      console.error("Error fetching top recipes by ratings:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchTopRecipesByRatings();
    fetchRecentRecipes();
  }, []);

  return (
    <div className="container home-page-contant">
      <div className="top-ratings-recipes">
        <h1>Top Rated Recipes</h1>
        <div className="top-ratings-recipes-cards">
          {topRecipes.map((recipe, index) => (
            <MiniRecipeCard key={index} recipeId={recipe} />
          ))}
        </div>
      </div>
      <div className="row home-page-contant-row1">
        <div className="col-12">
          <h1>How it Works</h1>
          <div className="home-page-contant-row1-flex">
            <div>
              <h2>Enter a Prompt</h2>
              <p>
                Enter the ingredients you have on hand, or a recipe idea you'd
                like to try. You can also specify dietary preferences, such as
                vegan, vegetarian, or gluten-free.
              </p>
            </div>
            <div>
              <h2>DailyRecipes Creates</h2>
              <p>
                DailyRecipes’s generative AI will parse your request and
                generate a brand-new recipe in seconds - complete with title,
                description, ingredients and steps.
              </p>
            </div>
            <div>
              <h2>Modify & Save</h2>
              <p>
                If the recipe isn't perfect the first time, you can request
                modifications. Then, register for a free account to save, print,
                and share all your recipe creations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row home-page-contant-row2">
        <div className="col-6 home-page-contant-row2-text">
          <div>
            <img src={fire} alt="fire" />
            <p className="home-page-contant-row2-text-features">FEATURES</p>
            <h1>More than just Recipes</h1>
            <p>Simply Put, DailyRecipes It's your new Personal Chef.</p>
          </div>
        </div>
        <div className="col-6">
          <img src={dish1} alt="dish1" />
        </div>
      </div>
      <div className="row home-page-contant-row3">
        <div className="col-6 home-page-contant-row3-img">
          <img src={dish2} alt="dish2" />
        </div>
        <div className="col-6 home-page-contant-row3-text">
          <h1>Creative Meal Planning in a Snap</h1>
          <p>
            Meal planning is a breeze with DailyRecipes. Say goodbye to hours
            spent browsing cookbooks or searching recipe blogs for ideas. Our
            powerful Idea Generator can provide 7 different suggestions for any
            requirements or list of ingredients. Then, it can create complete,
            detailed recipes for all your favorite suggestions.
          </p>
        </div>
      </div>
      <div className="top-ratings-recipes">
        <h1>Discover, Create, Share</h1>
        <p>Check out the most recently created recipes!</p>
        <div className="top-ratings-recipes-cards">
          {recentRecipes.map((recipe, index) => (
            <MiniRecipeCard key={index} recipeId={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePageContant;
