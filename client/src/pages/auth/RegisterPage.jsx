import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./RegisterPage.css";

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", data);
      alert("Inscription réussie !");
      console.log(response.data); // Vérifier la réponse du serveur
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error.response?.data || error.message);
      setServerError(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Créer un compte</h2>

        {/* Nom */}
        <div className="form-group">
          <label>Nom</label>
          <input type="text" {...register("name", { required: "Le nom est requis" })} />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email", { required: "L'email est requis" })} />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>

        {/* Mot de passe */}
        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" {...register("password", { required: "Mot de passe requis", minLength: { value: 6, message: "6 caractères minimum" } })} />
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        </div>

        {/* Message d'erreur serveur */}
        {serverError && <p className="error-message">{serverError}</p>}

        {/* Bouton de soumission */}
        <button type="submit" className="submit-btn">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegisterPage;