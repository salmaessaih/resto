import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
const defaultProfilePic = process.env.PUBLIC_URL + "/images/image.png";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log("Données utilisateur récupérées :", userData); // 🔥 Vérifie ce qui est stocké dans localStorage

      if (userData) {
        setUser(userData);
      } else {
        console.log("Aucun utilisateur trouvé, redirection vers login");
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement du profil :", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    console.log("Déconnexion en cours...");
    localStorage.removeItem("user"); // Supprime les infos de l'utilisateur
    console.log("Utilisateur supprimé du localStorage.");
    navigate("/login"); // Redirige vers la page de connexion
  };

  if (!user) {
    console.log("Utilisateur non défini, affichage du chargement...");
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profil Utilisateur</h1>
      <div className="profile-info">
      <img 
  src={user.profilePic && user.profilePic.trim() ? user.profilePic : defaultProfilePic} 
  alt="Profil" 
  className="profile-pic" 
  onError={(e) => {
    console.error("❌ Erreur de chargement de l'image, affichage de l'image par défaut");
    e.target.src = defaultProfilePic;
  }} 
/>

        <div className="user-details">
          <p><strong>Nom :</strong> {user.name || "Non défini"}</p>
          <p><strong>Email :</strong> {user.email || "Non défini"}</p>
          <p><strong>Rôle :</strong> {user.role || "Utilisateur"}</p>
        </div>
        <div className="button-container">
          <button className="back-button" onClick={() => {
            console.log("Retour en arrière");
            navigate(-1);
          }}>Retour</button>
          <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
