import React from "react";
import aboutUs_img from "../../assets/images/aboutUs_img.svg";
import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="aboutUs">
      <div className="aboutUs-1">
        <div className="aboutUs-1-1">
          <img
            className="aboutUs-1-1-img"
            src={aboutUs_img}
            alt="aboutUs_img"
          />
        </div>
        <div className="aboutUs-1-2">
          <div className="aboutUs-1-2-1">
            <h1 className="aboutUs-1-2-1-h1">Who We Are</h1>
            <p className="aboutUs-1-2-1-p">
              Welcome to Daily Recipes, your go-to platform for discovering and
              sharing delicious recipes. Whether you're a beginner or an
              experienced cook, our mission is to make cooking easy, enjoyable,
              and accessible to everyone. At Daily Recipes, we believe that food
              is more than just nourishment—it’s a way to connect, create, and
              explore. Our platform is designed to inspire you with a variety of
              recipes, from quick everyday meals to exciting new dishes. With
              personalized recommendations and easy-to-follow instructions, we
              make cooking a fun and effortless experience. Join our growing
              community of food lovers, save your favorite recipes, and embark
              on a journey of flavors. Let’s cook, create, and enjoy great food
              together!
            </p>
          </div>
          <div className="aboutUs-1-2-2">
            <div className="aboutUs-1-2-2-1">
              <h2 className="aboutUs-1-2-2-h2">Our Mission</h2>
              <p className="aboutUs-1-2-2-p">
                At Daily Recipes, we strive to empower every aspiring cook with
                accessible, easy-to-follow, and creative recipes. We believe
                that cooking isn’t just a daily routine; it’s a fun, fulfilling
                experience and a way to show care and love to those around us.
              </p>
            </div>
            <div className="aboutUs-1-2-2-2">
              <h2 className="aboutUs-1-2-2-h2">Our Vision</h2>
              <p className="aboutUs-1-2-2-p">
                To become the leading source of reliable recipes and daily
                inspiration for home cooks worldwide. Through our inclusive
                platform, we aim to build a vibrant cooking community where
                everyone can exchange ideas, share recipes effortlessly, and
                celebrate the art of food.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="aboutUs-2">
        <h1 className="aboutUs-2-h1">What Makes Us Unique?</h1>
        <div className="aboutUs-2-1">
          <div className="aboutUs-2-1-1">
            <h2 className="aboutUs-2-1-h2">Easy to Use</h2>
            <p className="aboutUs-2-1-p">
              Our platform is designed with simplicity in mind—whether you’re
              adding a new recipe or browsing existing ones, the process is
              quick and straightforward.
            </p>
          </div>
          <div className="aboutUs-2-1-1">
            <h2 className="aboutUs-2-1-h2">Recipe Variety</h2>
            <p className="aboutUs-2-1-p">
              We offer a wide range of recipes from different cuisines across
              the globe, catering to various taste preferences and dietary
              needs.
            </p>
          </div>
          <div className="aboutUs-2-1-1">
            <h2 className="aboutUs-2-1-h2">Inspirational Content</h2>
            <p className="aboutUs-2-1-p">
              We provide reliable cooking tips, articles, and videos to help you
              discover new ideas and improve your skills in the kitchen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
