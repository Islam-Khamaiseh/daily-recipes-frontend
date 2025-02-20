import React from "react";
import "./Footer.css";
import footerLogo from "../../assets/logo/footerLogo.svg";

const Footer = () => {
  return (
    <div className="container-fluid footer-page">
      <div className="row footer-page-row1">
        <div className="col-6 footer-page-row1-logo">
          <img
            src={footerLogo}
            alt="Daily Recipes Logo"
            className="footer-page-row1-logo-img"
          />
          <h4>Your AI Powered Digital Chef</h4>
          <p>© Copyright 2024 DailyRecipes. All Rights Reserved.</p>
        </div>
        <div className="col-6 footer-page-row1-content">
          <div>
            <h3>About Us</h3>
            <p>Blog</p>
            <p>Contact</p>
          </div>
          <div>
            <h3>Product</h3>
            <p>Pricing</p>
            <p>FAQ</p>
          </div>
          <div>
            <h3>Follow Us</h3>
            <p>Instagram</p>
            <p>TikTok</p>
            <p>Twitter</p>
          </div>
          <div>
            <h3>Legal</h3>
            <p>Terms</p>
            <p>Privacy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
