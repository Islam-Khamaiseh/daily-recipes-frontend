import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HistoryRecipes from "./pages/HistoryRecipes/HistoryRecipes";
import Home from "./pages/Home/Home";
import Account from "./pages/Account/Account";
import LoginSignup from "./pages/LoginSignup/LoginSignup";
import Profile from "./pages/Profile/Profile";
import Create from "./pages/Create/Create";
import AboutUs from "./pages/AboutUs/AboutUs";
import Recipe from "./pages/Recipe/Recipe";
import UserProfile from "./pages/UserProfile/UserProfile";
import SavedRecipes from "./pages/SavedRecipes/SavedRecipes";
import CommunityRecipes from "./pages/CommunityRecipes/CommunityRecipes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const App2 = () => {
  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/recipe/:id" element={<Recipe />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/community" element={<CommunityRecipes />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            >
              <Route path="history" element={<HistoryRecipes />} />
              <Route path="saved-recipes" element={<SavedRecipes />} />
              <Route path="account-details" element={<Profile />} />
            </Route>
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryRecipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-recipes"
              element={
                <ProtectedRoute>
                  <SavedRecipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App2;
