import React from "react";
import { Link } from "react-router-dom";
import homeright from "../images/homeright.png";

const Hero = () => {
  return (
    <div className="hero simple-hero">
      <div className="left">
        <span className="title">Smart Healthcare Consultation From Anywhere</span>
        <p>
          Welcome to Telemed UI. Book appointments, connect with doctors securely,
          and manage your healthcare needs in one simple place.
        </p>

        <div className="btns simple-btns">
          <Link to="/signup" className="btn1">Start Consultation</Link>
          <Link to="/login" className="btn2">Login</Link>
        </div>
      </div>

      <div className="right">
        <img src={homeright} alt="Doctor consultation illustration" />
      </div>
    </div>
  );
};

export default Hero;