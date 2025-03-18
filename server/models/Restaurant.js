const db = require('../config/db');

const Restaurant = {
    // Créer un restaurant
    create: (restaurantData, callback) => {
        const { name, adresse, description, phone, cuisineType } = restaurantData;
        const sql = "INSERT INTO restaurants (name, adresse, description, phone, cuisineType, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        db.query(sql, [name, adresse, description, phone, cuisineType], (err, result) => {
            if (err) return callback(err, null);
            callback(null, { id: result.insertId, ...restaurantData });
        });
    },

    // Récupérer tous les restaurants
    getAll: (callback) => {
        db.query("SELECT * FROM restaurants", (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Récupérer un restaurant par ID
    getById: (id, callback) => {
        db.query("SELECT * FROM restaurants WHERE id = ?", [id], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]);
        });
    },

    // Mettre à jour un restaurant
    update: (id, updatedData, callback) => {
        const { name, adresse, description, phone, cuisineType } = updatedData;
        const sql = "UPDATE restaurants SET name = ?, adresse = ?, description = ?, phone = ?, cuisineType = ? WHERE id = ?";
        db.query(sql, [name, adresse, description, phone, cuisineType, id], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },

    // Supprimer un restaurant
    delete: (id, callback) => {
        db.query("DELETE FROM restaurants WHERE id = ?", [id], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    }
};

module.exports = Restaurant;