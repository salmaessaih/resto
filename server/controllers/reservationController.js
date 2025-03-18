const Reservation = require('../models/Reservation');
const Table = require('../models/Table'); // Assurez-vous que le modèle Table est bien défini

// 🔹 Créer une nouvelle réservation avec vérification des tables disponibles
exports.createReservation = (req, res) => {
    const {
        user_id, restaurant_id, reservation_date, reservation_heure, nombre_personne, eventType,
        additionalNotes, birthdayPerson, addCake, specialDecoration, surprise,
        eventDetails, equipment, specialTable, menuType, musicPreference, status
    } = req.body;

    if (!user_id || !restaurant_id || !reservation_date || !reservation_heure || !nombre_personne || !eventType) {
        return res.status(400).json({ message: "❌ Tous les champs obligatoires doivent être remplis." });
    }

    console.log("🔍 Recherche d'une table disponible...");

    // Vérifier la disponibilité d'une table
    Table.findAvailableTable(restaurant_id, nombre_personne, (err, availableTable) => {
        if (err) {
            console.error("❌ Erreur SQL lors de la recherche de table :", err);
            return res.status(500).json({ message: "❌ Erreur serveur lors de la recherche de table." });
        }
        if (!availableTable) {
            return res.status(400).json({ message: "❌ Aucune table disponible pour cette réservation." });
        }

        console.log(`✅ Table disponible trouvée: ${availableTable.id}`);

        const reservationData = {
            user_id, restaurant_id, table_id: availableTable.id, reservation_date, reservation_heure,
            nombre_personne, eventType, additionalNotes, birthdayPerson, addCake, specialDecoration,
            surprise, eventDetails, equipment, specialTable, menuType, musicPreference,
            status: status || "reserved"
        };

        // Créer la réservation
        Reservation.create(reservationData, (err, result) => {
            if (err) {
                console.error("❌ Erreur SQL lors de la création de la réservation :", err);
                return res.status(500).json({ message: "❌ Erreur serveur lors de la réservation." });
            }

            console.log(`✅ Réservation créée avec ID: ${result.insertId}`);

            // Mettre à jour le statut de la table comme "reserved"
            Table.updateTableStatus(availableTable.id, "reserved", (err) => {
                if (err) {
                    console.error("⚠️ Erreur lors de la mise à jour du statut de la table :", err);
                } else {
                    console.log(`✅ Table ${availableTable.id} marquée comme réservée.`);
                }
            });

            res.status(201).json({ message: "✅ Réservation créée avec succès", reservationId: result.insertId });
        });
    });
};


// 🔹 Récupérer toutes les réservations
exports.getAllReservations = (req, res) => {
    Reservation.getAll((err, reservations) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération des réservations :", err);
            return res.status(500).json({ message: "❌ Erreur serveur" });
        }
        res.json(reservations);
    });
};


// 🔹 Récupérer une réservation par ID
exports.getReservationById = (req, res) => {
    const { id } = req.params;

    Reservation.getById(id, (err, reservation) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération de la réservation :", err);
            return res.status(500).json({ message: "❌ Erreur serveur" });
        }
        if (!reservation) {
            return res.status(404).json({ message: "❌ Réservation non trouvée" });
        }
        res.json(reservation);
    });
};



// 🔹 Mettre à jour une réservation
exports.updateReservation = (req, res) => {
    const { id } = req.params;
    const {
        reservation_date, reservation_heure, nombre_personne, eventType,
        additionalNotes, birthdayPerson, addCake, specialDecoration, surprise,
        eventDetails, equipment, specialTable, menuType, musicPreference, status
    } = req.body;

    if (!reservation_date || !reservation_heure || !nombre_personne || !eventType) {
        return res.status(400).json({ message: "❌ Tous les champs obligatoires doivent être remplis." });
    }

    const updatedData = {
        reservation_date, reservation_heure, nombre_personne, eventType,
        additionalNotes, birthdayPerson, addCake, specialDecoration, surprise,
        eventDetails, equipment, specialTable, menuType, musicPreference, status
    };

    Reservation.update(id, updatedData, (err, result) => {
        if (err) {
            console.error("❌ Erreur lors de la mise à jour de la réservation :", err);
            return res.status(500).json({ message: "❌ Erreur serveur" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "❌ Réservation non trouvée" });
        }
        res.json({ message: "✅ Réservation mise à jour avec succès" });
    });
};

// 🔹 Supprimer une réservation
exports.deleteReservation = (req, res) => {
    const { id } = req.params;

    // Récupérer la réservation pour libérer la table associée
    Reservation.getById(id, (err, reservation) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération de la réservation :", err);
            return res.status(500).json({ message: "❌ Erreur serveur" });
        }
        if (!reservation) {
            return res.status(404).json({ message: "❌ Réservation non trouvée" });
        }

        // Supprimer la réservation
        Reservation.delete(id, (err, result) => {
            if (err) {
                console.error("❌ Erreur lors de la suppression de la réservation :", err);
                return res.status(500).json({ message: "❌ Erreur serveur" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "❌ Réservation non trouvée" });
            }

            // Libérer la table associée
            Table.updateTableStatus(reservation.table_id, "available", (err) => {
                if (err) {
                    console.error("⚠️ Erreur lors de la libération de la table :", err);
                } else {
                    console.log(`✅ Table ${reservation.table_id} libérée.`);
                }
            });

            res.json({ message: "✅ Réservation supprimée avec succès et table libérée" });
        });
    });
};