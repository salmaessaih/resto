const Restaurant = require('../models/Restaurant');

// Créer un restaurant
exports.createRestaurant = (req, res) => {
    const { name, adresse, description, phone, cuisineType } = req.body;

    if (!name || !adresse || !description || !phone || !cuisineType) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const restaurantData = { name, adresse, description, phone, cuisineType };

    Restaurant.create(restaurantData, (err, result) => {
        if (err) {
            console.error("❌ Erreur lors de la création du restaurant :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.status(201).json({ message: "Restaurant créé avec succès", restaurantId: result.id });
    });
};

// Obtenir tous les restaurants
exports.getAllRestaurants = (req, res) => {
    Restaurant.getAll((err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération des restaurants :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        res.json(results);
    });
};

// Obtenir un restaurant par ID
exports.getRestaurantById = (req, res) => {
    const { id } = req.params;

    Restaurant.getById(id, (err, result) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération du restaurant :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        if (!result) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }
        res.json(result);
    });
};

// Mettre à jour un restaurant
exports.updateRestaurant = (req, res) => {
    const { id } = req.params;
    const { name, adresse, description, phone, cuisineType } = req.body;

    if (!name || !adresse || !description || !phone || !cuisineType) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const updatedData = { name, adresse, description, phone, cuisineType };

    Restaurant.update(id, updatedData, (err, result) => {
        if (err) {
            console.error("❌ Erreur lors de la mise à jour du restaurant :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }
        res.json({ message: "Restaurant mis à jour avec succès" });
    });
};

// Supprimer un restaurant
exports.deleteRestaurant = (req, res) => {
    const { id } = req.params;

    Restaurant.delete(id, (err, result) => {
        if (err) {
            console.error("❌ Erreur lors de la suppression du restaurant :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Restaurant non trouvé" });
        }
        res.json({ message: "Restaurant supprimé avec succès" });
    });
};