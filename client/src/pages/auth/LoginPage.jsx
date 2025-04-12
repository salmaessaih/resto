import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log("Données envoyées :", { email, password }); // Log des données envoyées
      const response = await authService.login({ email, password });
      console.log("Réponse du serveur :", response); // Log de la réponse du serveur

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user)); // Stockez toutes les infos de l'utilisateur
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la connexion :", error); // Log de l'erreur
      setError(error.message || "Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome back!</h1>
        <p>You can sign in to access with your existing account.</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="sign-in-button">Sign In</button>
        </form>
        <p className="additional-info">
          Don't have an account? <a href="/register">Register here</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;