const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Middleware d'authentification
const isAdmin = require('../middleware/isAdmin'); // Middleware pour vérifier si l'utilisateur est admin

console.log("✅ Routes utilisateurs chargées !");

// ✅ Inscription et connexion
router.post('/register', userController.register);
router.post('/login', userController.login);

// ✅ Récupération du profil utilisateur (profil de l'utilisateur connecté)
router.get('/me', auth, userController.getUserProfile);

// ✅ Mise à jour du profil utilisateur
router.put('/:id', auth, userController.updateUserProfile);

// ✅ Récupération d'un utilisateur par ID
router.get('/:id', auth, userController.getUserById);

// ✅ Suppression du compte utilisateur
router.delete('/:id', auth, userController.deleteUser);

// ✅ Gestion des utilisateurs (Admin uniquement)
router.get('/', auth, isAdmin, userController.getAllUsers);

module.exports = router;
