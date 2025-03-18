const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth'); // Middleware d'authentification
const isAdmin = require('../middleware/isAdmin'); // Middleware pour vérifier si l'utilisateur est admin

// 🔹 Créer un restaurant (ADMIN uniquement)
router.post('/', auth, isAdmin, restaurantController.createRestaurant);

// 🔹 Récupérer tous les restaurants (Accessible aux utilisateurs authentifiés)
router.get('/', auth, restaurantController.getAllRestaurants);

// 🔹 Récupérer un restaurant par ID (Accessible aux utilisateurs authentifiés)
router.get('/:id', auth, restaurantController.getRestaurantById);

// 🔹 Mettre à jour un restaurant (ADMIN uniquement)
router.put('/:id', auth, isAdmin, restaurantController.updateRestaurant);

// 🔹 Supprimer un restaurant (ADMIN uniquement)
router.delete('/:id', auth, isAdmin, restaurantController.deleteRestaurant);

module.exports = router;