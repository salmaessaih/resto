import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import "./RestaurantDetails.css";

const imagesByRestaurant = {
    1: ["res1.jpg", "takeshi1.jpeg", "takeshi2.jpeg", "takeshi3.jpeg"],
    2: ["res2.jpg", "italian1.jpeg", "italian2.jpeg", "italian3.jpeg", "italian4.jpeg"],
    3: ["res3.jpg", "la_patte1.jpeg", "la_patte2.jpeg", "la_patte3.jpeg"],
    4: ["res4.jpg", "quan_nha1.jpeg", "quan_nha2.jpeg", "quan_nha3.jpeg", "quan_nha4.jpeg"],
    5: ["res5.jpg", "bistrot1.jpeg", "bistrot2.jpeg", "bistrot3.jpeg", "bistrot4.jpeg"],
    6: ["res6.jpg", "le_comptoir1.jpeg", "le_comptoir2.jpeg", "le_comptoir3.jpeg"],
    7: ["res7.jpg", "ralph_lauren1.jpeg", "ralph_lauren2.jpeg", "ralph_lauren3.jpeg", "ralph_lauren4.jpeg"],
    8: ["res8.jpg", "ratatouille1.jpeg", "ratatouille2.jpeg", "ratatouille3.jpeg", "ratatouille4.jpeg"],
  };
  

const RestaurantDetails = ({ restaurants }) => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (restaurants && Array.isArray(restaurants)) {
      const selectedRestaurant = restaurants.find((resto) => resto.id === Number(id));
      setRestaurant(selectedRestaurant || null);
    }
  }, [id, restaurants]);

  if (!restaurant) {
    return <p className="error-message">Restaurant non trouvé</p>;
  }

  return (
    <div className="restaurant-details">
      {/* Carrousel Swiper à gauche */}
      <div className="carousel-container">
        <Swiper navigation={true} modules={[Navigation]} className="swiper-container">
          {imagesByRestaurant[Number(id)]?.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={`/images/${img}`} alt={`${restaurant.name} - Vue ${index + 1}`} className="carousel-image" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Infos du restaurant à droite */}
      <div className="restaurant-info">
        <h2>{restaurant.name}</h2>
        <p><strong>Type :</strong> {restaurant.cuisineType}</p>
        <p><strong>Adresse :</strong> {restaurant.adresse}</p>
        <p><strong>Description :</strong> {restaurant.description}</p>
        <p><strong>Téléphone :</strong> {restaurant.phone}</p>
        <button className="reserve-button">Réserver maintenant</button>
      </div>
    </div>
  );
};

export default RestaurantDetails;
