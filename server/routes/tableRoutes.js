const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

console.log("✅ tableRoutes.js chargé avec succès !"); // 🛠 Log pour confirmer que le fichier est bien importé

// 🔹 Route de test pour voir si les routes sont bien prises en compte
router.get('/test', (req, res) => {
    res.json({ message: "✅ Routes des tables fonctionnent !" });
});

// Middleware pour logger toutes les requêtes sur /api/tables
router.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.originalUrl}`, req.body);
    next();
});

// 🔹 Ajouter une table (Admin uniquement)
router.post('/', auth, isAdmin, tableController.addTable);

// 🔹 Modifier une table (Admin uniquement)
router.put('/:id', auth, isAdmin, tableController.updateTable);

// 🔹 Supprimer une table (Admin uniquement)
router.delete('/:id', auth, isAdmin, tableController.deleteTable);

// 🔹 Voir les tables d'un restaurant
router.get('/restaurant/:restaurant_id', tableController.getTablesByRestaurant);

// 🔹 Vérifier la disponibilité des tables
router.get('/availability', tableController.getAvailableTables);

// 🔹 Route pour mettre à jour le statut d'une table
router.put('/status', tableController.updateTableStatus);

module.exports = router;