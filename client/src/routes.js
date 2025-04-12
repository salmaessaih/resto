import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import RestaurantDetails from './pages/restaurant/RestaurantDetails';
import { useEffect, useState } from "react";

const RoutesComponent = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token récupéré :", token);
    

    fetch("http://localhost:5000/api/restaurants", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ajout de l'authentification si nécessaire
      },
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log("Restaurants récupérés:", data);
        setRestaurants(data);
      })
      .catch(error => console.error("Erreur API:", error));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails restaurants={restaurants} />} />
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
