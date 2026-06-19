import React, { useState } from "react";
import telemedlogo from "../images/telemedlogo.png";

import { Link } from "react-router-dom";
{/* <Link to="/signup">
  <button className="btn1">Sign Up</button>
</Link> */}
const Navbar = ({ setShowSignup }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="navbar">

      <img src={telemedlogo} alt="Telemed Logo" />

      <button className="navbar-toggle" onClick={toggleMenu} aria-expanded={isMenuOpen}>
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li><a href="#home" onClick={closeMenu}>HOME</a></li>
          <li><a href="#about" onClick={closeMenu}>ABOUT</a></li>
          <li><a href="#services" onClick={closeMenu}>SERVICES</a></li>
        </ul>
      </nav>

      <Link to="/signup">
        <button className="btn1" onClick={closeMenu}>Sign Up</button>
      </Link>

    </div>
  );
};

export default Navbar;