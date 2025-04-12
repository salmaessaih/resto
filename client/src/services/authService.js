import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // URL de votre backend

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
  }
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
  }
};

export default { register, login };
