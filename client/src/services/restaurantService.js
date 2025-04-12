import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RestaurantDetails = () => {
  const { id } = useParams(); // Récupérer l'ID du restaurant depuis l'URL
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/restaurants/${id}`)
      .then((response) => {
        setRestaurant(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du restaurant :", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!restaurant) {
    return <p>Restaurant non trouvé.</p>;
  }

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p><strong>Type de cuisine :</strong> {restaurant.cuisineType}</p>
      <p><strong>Adresse :</strong> {restaurant.adresse}</p>
      <p><strong>Téléphone :</strong> {restaurant.phone}</p>
      <p><strong>Description :</strong> {restaurant.description}</p>
    </div>
  );
};

export default RestaurantDetails;
