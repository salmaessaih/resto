const db = require('../config/db');

const User = {
    create: ({ name, email, password, role = 'user' }, callback) => {
        db.query(
            'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
            [name, email, password, role],
            (err, result) => {
                if (err) {
                    console.error("❌ Erreur lors de la création de l'utilisateur :", err);
                    return callback(err, null);
                }
                callback(null, { insertId: result.insertId });
            }
        );
    },

    findByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error("❌ Erreur lors de la recherche par email :", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    findById: (id, callback) => {
        db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error("❌ Erreur lors de la recherche par ID :", err);
                return callback(err, null);
            }
            callback(null, results.length > 0 ? results[0] : null);
        });
    },

    update: (id, userData, callback) => {
        let query = 'UPDATE users SET name = ?, email = ?, role = ?';
        let params = [userData.name, userData.email, userData.role, id];
        
        if (userData.password) {
            query = 'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?';
            params = [userData.name, userData.email, userData.password, userData.role, id];
        }

        db.query(query, params, (err, result) => {
            if (err) {
                console.error("❌ Erreur lors de la mise à jour de l'utilisateur :", err);
                return callback(err, null);
            }
            callback(null, result);
        });
    },

    delete: (id, callback) => {
        db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error("❌ Erreur lors de la suppression de l'utilisateur :", err);
                return callback(err, null);
            }
            callback(null, result);
        });
    }
};

module.exports = User;