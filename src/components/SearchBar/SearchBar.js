import React, { useState, useRef, useEffect } from "react";
import { auth } from "../../config/firebase";
import axios from "axios";
import "./SearchBar.css";
import styles from "./SearchBar.module.css";

const SearchBar = ({ onSearchResults }) => {
  const [recipeId, setRecipeId] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [dietarys, setDietarys] = useState([]);
  const [nutritionalFocus, setNutritionalFocus] = useState([]);
  const [cookingTime, setCookingTime] = useState("");
  const [additionalIngredients, setAdditionalIngredients] = useState(
    "with additional ingredients"
  );
  const [region, setRegion] = useState("");
  const dropdownRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);

  // const additionalIngredientsOptions = [
  //   "with additional ingredients",
  //   "without additional  ingredients",
  // ];

  const cookingTimeOptions = [
    "under 5 minutes",
    "5-10 minutes",
    "10-20 minutes",
    "20-30 minutes",
    "30-60 minutes",
    "above 60 minutes",
  ];

  const equipmentOptions = [
    "Oven",
    "Microwave",
    "Air Fryer",
    "Stovetop",
    "Toaster",
    "Waffle Maker",
    "Outdoor Grill",
  ];

  const dietarysOptions = [
    "Dairy-Free",
    "Gluten-Free",
    "Halal",
    "Keto",
    "Kosher",
    "Nut-Free",
    "Paleo",
    "Pescatarian",
    "Vegan",
    "Vegetarian",
  ];

  const nutritionalFocusOptions = [
    "High Protein",
    "Low Carb",
    "Low Fat",
    "Low Sodium",
    "High Fiber",
    "Diabetic-Friendly",
    "Heart-Healthy",
    "Weight Loss",
    "Low Cholesterol",
  ];

  const RegionOptions = [
    "Chinese",
    "Egyptian",
    "French",
    "Greek",
    "Indian",
    "Italian",
    "Japanese",
    "Korean",
    "Lebanese",
    "Mexican",
    "Moroccan",
    "Palestinian",
    "Spanish",
    "Thai",
    "Turkish",
  ];

  const handleToggleDropdown = () => {
    setShowFilters(!showFilters);
  };

  const handleToggleEquipments = (equipment) => {
    if (equipments.includes(equipment)) {
      setEquipments(equipments.filter((f) => f !== equipment));
      setFiltersCount(filtersCount - 1);
    } else {
      setEquipments([...equipments, equipment]);
      setFiltersCount(filtersCount + 1);
    }
  };

  const handleToggleNutritionalFocus = (nutritional) => {
    if (nutritionalFocus.includes(nutritional)) {
      setNutritionalFocus(nutritionalFocus.filter((f) => f !== nutritional));
      setFiltersCount(filtersCount - 1);
    } else {
      setNutritionalFocus([...nutritionalFocus, nutritional]);
      setFiltersCount(filtersCount + 1);
    }
  };

  const handleToggleDietarys = (dietary) => {
    if (dietarys.includes(dietary)) {
      setDietarys(dietarys.filter((f) => f !== dietary));
      setFiltersCount(filtersCount - 1);
    } else {
      setDietarys([...dietarys, dietary]);
      setFiltersCount(filtersCount + 1);
    }
  };

  const handleToggleCookingTime = (time) => {
    if (time === cookingTime) {
      setCookingTime("");
      setFiltersCount(filtersCount - 1);
    } else {
      if (!cookingTime) {
        setFiltersCount(filtersCount + 1);
      }
      setCookingTime(time);
    }
  };

  // const handleToggleAdditionalIngredients = (additional) => {
  //   setAdditionalIngredients(additional);
  // };

  const handleToggleRegion = (region1) => {
    if (region1 === region) {
      setRegion("");
      setFiltersCount(filtersCount - 1);
    } else {
      if (!region) {
        setFiltersCount(filtersCount + 1);
      }
      setRegion(region1);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowFilters(false);
    }
  };

  const handleGenerate = async (e) => {
    if (ingredients.length === 0) {
      setErrorMessage("You must enter at least one ingredient.");
      return;
    }
    setErrorMessage("");
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      ingredients,
      cookingTime,
      equipments,
      dietarys,
      nutritionalFocus,
      region,
      additionalIngredients,
    };

    try {
      let token = undefined;

      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data.success) {
        setRecipeId(data.recipeId);
        onSearchResults(data.recipeId);
      } else {
        console.error("Server error:", data.error);
      }
    } catch (error) {
      console.error("Request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="recipe-input-description">
        <h1>What’s Cooking Today?</h1>
        <h1 className="recipe-input-description-h1-line2">
          Let AI Create Your Perfect Recipe!
        </h1>
        <p>
          Simply enter the ingredients you have at home, and our AI will craft a
          delicious, personalized recipe in seconds.
        </p>
        <p className="recipe-input-description-p-line2">
          No more guesswork—just tasty meals made easy!
        </p>
      </div>

      <div className="recipe-input-container">
        <div className="filter">
          <input
            className={`${styles.filterInput} ${
              filtersCount ? styles.filterInputActive : ""
            }`}
            type="text"
            value={
              filtersCount
                ? `Select filters(${filtersCount})`
                : "Select filters"
            }
            readOnly
            placeholder="Select filters"
            onClick={handleToggleDropdown}
          />
          {showFilters && (
            <div className="filter-dropdown" ref={dropdownRef}>
              <div className="filter-dropdown-1">
                {/* <div className="filter-dropdown-1-1">
                  <p>Ingredients</p>
                  {additionalIngredientsOptions.map((additional, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleToggleAdditionalIngredients(additional)
                      }
                      className={`${styles.filterButton} ${
                        additional === additionalIngredients
                          ? styles.active
                          : ""
                      }`}
                    >
                      {additional}
                    </button>
                  ))}
                </div> */}
                <div className="filter-dropdown-1-2">
                  <p>Cooking Time</p>
                  {cookingTimeOptions.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleToggleCookingTime(time)}
                      className={`${styles.filterButton} ${
                        time === cookingTime ? styles.active : ""
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-dropdown-2">
                <p>Equipments</p>
                {equipmentOptions.map((equipment, index) => (
                  <button
                    key={index}
                    onClick={() => handleToggleEquipments(equipment)}
                    className={`${styles.filterButton} ${
                      equipments.includes(equipment) ? styles.active : ""
                    }`}
                  >
                    {equipment}
                  </button>
                ))}
              </div>
              <div className="filter-dropdown-3">
                <p>Dietary Preferences</p>
                {dietarysOptions.map((dietary, index) => (
                  <button
                    key={index}
                    onClick={() => handleToggleDietarys(dietary)}
                    className={`${styles.filterButton} ${
                      dietarys.includes(dietary) ? styles.active : ""
                    }`}
                  >
                    {dietary}
                  </button>
                ))}
              </div>
              <div className="filter-dropdown-4">
                <p>Nutritional Focus</p>
                {nutritionalFocusOptions.map((nutritional, index) => (
                  <button
                    key={index}
                    onClick={() => handleToggleNutritionalFocus(nutritional)}
                    className={`${styles.filterButton} ${
                      nutritionalFocus.includes(nutritional)
                        ? styles.active
                        : ""
                    }`}
                  >
                    {nutritional}
                  </button>
                ))}
              </div>

              <div className="filter-dropdown-5">
                <div>
                  <p>Cuisine/Region</p>
                </div>
                <div className="filter-dropdown-5-1">
                  {RegionOptions.map((region1, index) => (
                    <button
                      key={index}
                      onClick={() => handleToggleRegion(region1)}
                      className={`${styles.filterButton} ${
                        region1 === region ? styles.active : ""
                      }`}
                    >
                      {region1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="rice, chicken, ..."
          className="recipe-input"
          onChange={(e) =>
            setIngredients(e.target.value.split(",").map((item) => item.trim()))
          }
        />

        <button className="generate-btn" onClick={handleGenerate}>
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default SearchBar;
