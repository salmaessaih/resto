// src/components/Navbar.jsx
import React from "react";
import "../../pages/home/HomePage.css"; // ✅ Correct
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Restaurant</div>
      <ul className="nav-links">
        <li><a href="/">Accueil</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className="nav-buttons">
        <button className="lang-btn">🇬🇧 EN</button>
        <button className="lang-btn">🇫🇷 FR</button>
        <button className="login-btn">Se connecter</button>
      </div>
    </nav>
  );
};

export default Navbar;