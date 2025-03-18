const db = require('../config/db');

const Reservation = {
    // 🔹 Créer une réservation avec transaction SQL
    create: (reservationData, callback) => {
        const {
            user_id, restaurant_id, reservation_date, reservation_heure, nombre_personne, eventType,
            additionalNotes, birthdayPerson, addCake, specialDecoration, surprise,
            eventDetails, equipment, specialTable, menuType, musicPreference, status
        } = reservationData;

        db.beginTransaction((err) => {
            if (err) {
                console.error("❌ Erreur lors du démarrage de la transaction :", err);
                return callback(err);
            }

            console.log("🔍 Recherche d'une table disponible...");
            const tableQuery = `
                SELECT * FROM tables 
                WHERE restaurant_id = ? AND capacity >= ? AND status = 'available' 
                LIMIT 1 FOR UPDATE
            `;

            db.query(tableQuery, [restaurant_id, nombre_personne], (err, tables) => {
                if (err) {
                    console.error("❌ Erreur SQL lors de la recherche de table :", err);
                    return db.rollback(() => callback(err));
                }
                if (tables.length === 0) {
                    console.log("❌ Aucune table disponible !");
                    return db.rollback(() => callback(null, { message: "Aucune table disponible pour cette réservation." }));
                }

                const table_id = tables[0].id;
                console.log(`✅ Table disponible trouvée: ${table_id}`);

                const sql = `
                    INSERT INTO reservations 
                    (user_id, restaurant_id, table_id, reservation_date, reservation_heure, nombre_personne, eventType,
                    additionalNotes, birthdayPerson, addCake, specialDecoration, surprise,
                    eventDetails, equipment, specialTable, menuType, musicPreference, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(sql, [
                    user_id, restaurant_id, table_id, reservation_date, reservation_heure, nombre_personne, eventType,
                    additionalNotes, birthdayPerson, addCake, specialDecoration, surprise,
                    eventDetails, JSON.stringify(equipment), specialTable, menuType, musicPreference, status || 'reserved'
                ], (err, result) => {
                    if (err) {
                        console.error("❌ Erreur lors de l'insertion de la réservation :", err);
                        return db.rollback(() => callback(err));
                    }

                    console.log(`✅ Réservation créée avec ID: ${result.insertId}`);

                    const updateTableStatus = `UPDATE tables SET status = 'occupied' WHERE id = ?`;
                    db.query(updateTableStatus, [table_id], (err) => {
                        if (err) {
                            console.error("❌ Erreur lors de la mise à jour du statut de la table :", err);
                            return db.rollback(() => callback(err));
                        }

                        db.commit((err) => {
                            if (err) {
                                console.error("❌ Erreur lors de la validation de la transaction :", err);
                                return db.rollback(() => callback(err));
                            }

                            console.log(`✅ Table ${table_id} marquée comme occupée.`);
                            callback(null, { id: result.insertId, table_id, ...reservationData });
                        });
                    });
                });
            });
        });
    },

    // 🔹 Supprimer une réservation et libérer la table
    delete: (id, callback) => {
        db.beginTransaction((err) => {
            if (err) {
                console.error("❌ Erreur lors du démarrage de la transaction :", err);
                return callback(err);
            }

            console.log(`🔍 Recherche de la réservation ID: ${id}`);
            db.query("SELECT table_id FROM reservations WHERE id = ?", [id], (err, results) => {
                if (err) {
                    console.error("❌ Erreur SQL lors de la récupération de la réservation :", err);
                    return db.rollback(() => callback(err));
                }
                if (results.length === 0) {
                    console.log("❌ Réservation non trouvée !");
                    return callback(null, { message: "Réservation non trouvée." });
                }

                const table_id = results[0].table_id;

                console.log(`🗑 Suppression de la réservation ID: ${id}`);
                db.query("DELETE FROM reservations WHERE id = ?", [id], (err) => {
                    if (err) {
                        console.error("❌ Erreur lors de la suppression de la réservation :", err);
                        return db.rollback(() => callback(err));
                    }

                    if (!table_id) {
                        console.warn("⚠️ Pas de table associée à cette réservation !");
                        return db.commit((err) => {
                            if (err) return db.rollback(() => callback(err));
                            callback(null, { message: "Réservation supprimée." });
                        });
                    }

                    console.log(`🔄 Libération de la table ID: ${table_id}`);
                    db.query("UPDATE tables SET status = 'available' WHERE id = ?", [table_id], (err) => {
                        if (err) {
                            console.error("❌ Erreur lors de la mise à jour du statut de la table :", err);
                            return db.rollback(() => callback(err));
                        }

                        db.commit((err) => {
                            if (err) {
                                console.error("❌ Erreur lors de la validation de la transaction :", err);
                                return db.rollback(() => callback(err));
                            }

                            console.log(`✅ Table ${table_id} libérée.`);
                            callback(null, { message: "Réservation annulée et table libérée." });
                        });
                    });
                });
            });
        });
    }
};

module.exports = Reservation;