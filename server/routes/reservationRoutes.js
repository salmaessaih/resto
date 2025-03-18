const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth'); // Middleware d'authentification
const isAdmin = require('../middleware/isAdmin'); // Middleware pour vérifier si l'utilisateur est admin

// 🔹 Créer une réservation (Accessible aux utilisateurs authentifiés)
router.post('/', auth, reservationController.createReservation);

// 🔹 Récupérer toutes les réservations (ADMIN uniquement)
router.get('/', auth, isAdmin, reservationController.getAllReservations);

// 🔹 Récupérer une réservation par ID (Accessible uniquement par l'utilisateur qui l'a créée ou un ADMIN)
router.get('/:id', auth, reservationController.getReservationById);

// 🔹 Mettre à jour une réservation (Seul l'utilisateur ayant fait la réservation peut la modifier)
router.put('/:id', auth, reservationController.updateReservation);

// 🔹 Supprimer une réservation (ADMIN uniquement)
router.delete('/:id', auth, isAdmin, reservationController.deleteReservation);

module.exports = router;