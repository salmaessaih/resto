const db = require('../config/db');

const Table = {
    // 🔹 Trouver une table disponible avec verrouillage (évite conflits de réservation simultanée)
    findAvailableTable: (restaurant_id, nombre_personne, callback) => {
        const sql = `
            SELECT * FROM tables 
            WHERE restaurant_id = ? AND capacity >= ? AND status = 'available' 
            ORDER BY capacity ASC
            LIMIT 1 FOR UPDATE;
        `;
        db.query(sql, [restaurant_id, nombre_personne], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results.length ? results[0] : null);
        });
    },

    // 🔹 Mettre à jour le statut d'une table
    updateTableStatus: (table_id, status, callback) => {
        const allowedStatuses = ['available', 'reserved', 'occupied'];
        if (!allowedStatuses.includes(status)) {
            return callback(new Error(`❌ Statut invalide: ${status}`));
        }
        const sql = `UPDATE tables SET status = ? WHERE id = ?`;
        db.query(sql, [status, table_id], (err, result) => {
            if (err) return callback(err);
            if (result.affectedRows === 0) {
                return callback(new Error(`⚠ Aucune table trouvée avec ID: ${table_id}`));
            }
            callback(null, result);
        });
    },

    // 🔹 Obtenir toutes les tables d'un restaurant
    getTablesByRestaurant: (restaurant_id, callback) => {
        const sql = `SELECT * FROM tables WHERE restaurant_id = ?`;
        db.query(sql, [restaurant_id], callback);
    },

    // 🔹 Ajouter une nouvelle table
    createTable: (tableData, callback) => {
        const { restaurant_id, capacity, table_number } = tableData;
        const sql = `INSERT INTO tables (restaurant_id, capacity, table_number, status) VALUES (?, ?, ?, 'available')`;
        db.query(sql, [restaurant_id, capacity, table_number], callback);
    }
};

module.exports = Table;
