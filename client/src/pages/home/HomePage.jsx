import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

// Chemins des images statiques
const logo = "/images/log.jpg";
const profilePic = "/images/image.png";
const backgroundImage = "/images/pg.jpg";

// Fonction pour obtenir le chemin correct des images des restaurants
const restaurantImagePath = (imageName) => `/images/${imageName}`;

const HomePage = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: "Takeshi",
      cuisine: "Cuisine japonaise",
      image: restaurantImagePath("res1.jpg"),
    },
    {
      id: 2,
      name: "Italian",
      cuisine: "Cuisine italienne",
      image: restaurantImagePath("res2.jpg"),
    },
    {
      id: 3,
      name: "La Patte",
      cuisine: "Cuisine mexicaine",
      image: restaurantImagePath("res3.jpg"),
    },
    {
      id: 4,
      name: "Quan Nha",
      cuisine: "Cuisine chinoise",
      image: restaurantImagePath("res4.jpg"),
    },
    {
      id: 5,
      name: "Bistrot Chey Rémy",
      cuisine: "Cuisine indienne",
      image: restaurantImagePath("res5.jpg"),
    },
    {
      id: 6,
      name: "Le Comptoir",
      cuisine: "Cuisine française",
      image: restaurantImagePath("res6.jpg"),
    },
    {
      id: 7,
      name: "Ralph Lauren",
      cuisine: "Cuisine thaïlandaise",
      image: restaurantImagePath("res7.jpg"),
    },
    {
      id: 8,
      name: "Ratatouille",
      cuisine: "Cuisine libanaise",
      image: restaurantImagePath("res8.jpg"),
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error(
        "Erreur lors de la lecture des données d'utilisateur :",
        error
      );
      localStorage.removeItem("user");
    }
  }, []);

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <ul className="nav-links">
          <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Home
          </li>
          <li
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            Restaurants
          </li>
          <li
            onClick={() =>
              window.scrollTo({
                top: 2 * window.innerHeight,
                behavior: "smooth",
              })
            }
          >
            Contact
          </li>
        </ul>
        {user ? (
          <div className="profile" onClick={() => navigate("/profile")}>
            <img src={profilePic} alt="Profil" className="profile-pic" />
            <span>{user.name}</span>
          </div>
        ) : (
          <button className="login-button" onClick={() => navigate("/login")}>
            Se connecter
          </button>
        )}
      </nav>

      {/* Section Hero */}
      <section
        className="section-1"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="hero">
          <h1>Bienvenue sur notre plateforme de réservation</h1>
          <p>
            Réservez votre table dans les meilleurs restaurants de la ville.
          </p>
          <button
            className="reserve-button"
            onClick={() => navigate("/reservation")}
          >
            Réserver maintenant
          </button>
        </div>
      </section>

      {/* Section Recherche et Restaurants */}
      <section className="section-2">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher par type de cuisine ou nom de restaurant"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="restaurant-image"
              />
              <h3>{restaurant.name}</h3>
              <p>{restaurant.cuisine}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Contact */}
      <section className="section-3">
        <h2>Contactez-nous</h2>
        <div className="contact-info">
          <p>
            Téléphone :{" "}
            <a href="tel:+1234567890" className="contact-link">
              +123 456 7890
            </a>
          </p>
          <p>
            Email :{" "}
            <a href="mailto:contact@restaurant.com" className="contact-link">
              contact@restaurant.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
