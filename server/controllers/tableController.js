const db = require('../config/db'); // Connexion à la base de données
const Table = require('../models/Table');

// ✅ Ajouter une table
exports.addTable = (req, res) => {
    const { restaurant_id, capacity, table_number, status } = req.body;

    if (!restaurant_id || !capacity || !table_number) {
        return res.status(400).json({ message: "❌ Tous les champs sont obligatoires." });
    }

    const sql = "INSERT INTO tables (restaurant_id, capacity, table_number, status) VALUES (?, ?, ?, ?)";
    db.query(sql, [restaurant_id, capacity, table_number, status || 'available'], (err, result) => {
        if (err) {
            console.error("❌ Erreur lors de l'ajout de la table :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        res.status(201).json({ message: "✅ Table ajoutée avec succès !", table_id: result.insertId });
    });
};

// ✅ Modifier une table
exports.updateTable = (req, res) => {
    const { id } = req.params;
    const { capacity, table_number, status } = req.body;

    if (!id || !capacity || !table_number || !status) {
        return res.status(400).json({ message: "❌ Tous les champs sont obligatoires." });
    }

    const sql = "UPDATE tables SET capacity = ?, table_number = ?, status = ? WHERE id = ?";
    db.query(sql, [capacity, table_number, status, id], (err, result) => {
        if (err) {
            console.error("❌ Erreur lors de la mise à jour :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "❌ Aucune table trouvée avec cet ID." });
        }
        res.json({ message: "✅ Table mise à jour avec succès !" });
    });
};

// ✅ Supprimer une table
exports.deleteTable = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "❌ ID de table requis." });
    }

    const sql = "DELETE FROM tables WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Erreur lors de la suppression :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "❌ Aucune table trouvée avec cet ID." });
        }
        res.json({ message: "✅ Table supprimée avec succès !" });
    });
};

// ✅ Obtenir les tables d'un restaurant
exports.getTablesByRestaurant = (req, res) => {
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
        return res.status(400).json({ message: "❌ ID du restaurant requis." });
    }

    const sql = "SELECT * FROM tables WHERE restaurant_id = ?";
    db.query(sql, [restaurant_id], (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        res.json(results);
    });
};

// ✅ Vérifier les tables disponibles
exports.getAvailableTables = (req, res) => {
    const sql = "SELECT * FROM tables WHERE status = 'available'";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération des tables disponibles :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        res.json(results);
    });
};

// ✅ Mettre à jour le statut d'une table
exports.updateTableStatus = (req, res) => {
    const { table_id, status } = req.body;

    console.log("📩 Requête reçue pour mise à jour du statut d'une table.");
    console.log(`📌 ID Table : ${table_id}, Nouveau Statut : ${status}`);

    // Vérifier si les valeurs sont bien fournies
    if (!table_id || !status) {
        console.error("❌ Erreur : ID de table et statut requis !");
        return res.status(400).json({ message: "❌ ID de table et statut requis." });
    }

    // Vérifier si la table existe
    Table.getById(table_id, (err, table) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération de la table :", err);
            return res.status(500).json({ message: "❌ Erreur serveur lors de la récupération de la table." });
        }
        if (!table) {
            console.warn(`⚠️ Aucune table trouvée avec l'ID ${table_id}`);
            return res.status(404).json({ message: "❌ Aucune table trouvée avec cet ID." });
        }

        console.log(`✅ Table trouvée : ID ${table_id}, Statut actuel : ${table.status}`);

        // Mettre à jour le statut de la table
        Table.updateTableStatus(table_id, status, (err, result) => {
            if (err) {
                console.error("❌ Erreur lors de la mise à jour du statut de la table :", err);
                return res.status(500).json({ message: "❌ Erreur serveur lors de la mise à jour." });
            }
            console.log(`✅ Succès : Table ${table_id} mise à jour avec le statut '${status}'`);
            res.json({ message: `✅ Statut de la table ${table_id} mis à jour en '${status}'.` });
        });
    });
};