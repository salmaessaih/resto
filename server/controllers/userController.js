const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Middleware pour protéger les routes

// ✅ Inscription d'un nouvel utilisateur
exports.register = (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const checkEmailSQL = "SELECT id FROM users WHERE email = ?";
    db.query(checkEmailSQL, [email], (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la vérification de l'email :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

        db.query(sql, [name, email, hashedPassword, role], (err) => {
            if (err) {
                console.error("❌ Erreur lors de l'inscription :", err);
                return res.status(500).json({ message: "Erreur serveur." });
            }
            res.status(201).json({ message: "Utilisateur inscrit avec succès !" });
        });
    });
};

// ✅ Connexion de l'utilisateur
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la connexion :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Connexion réussie !", token, role: user.role });
    });
};

// ✅ Récupération du profil utilisateur connecté
exports.getUserProfile = async (req, res) => {
    try {
        console.log("📢 Requête pour récupérer le profil de l'utilisateur :", req.user);

        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Récupération d'un utilisateur par ID (Uniquement si admin ou utilisateur lui-même)

exports.getUserById = (req, res) => {
    const userId = req.user.id;
    const requestedId = req.params.id;

    console.log("🔍 Utilisateur connecté - ID :", userId, "| Rôle :", req.user.role);
    console.log("🔍 ID demandé dans l'URL :", requestedId);

    if (isNaN(requestedId)) {
        return res.status(400).json({ message: "❌ ID invalide." });
    }

    if (Number(requestedId) !== Number(userId) && req.user.role !== 'admin') {
        console.log("🚫 Accès refusé. L'utilisateur n'est ni admin ni le propriétaire du compte.");
        return res.status(403).json({ message: "⛔ Accès refusé." });
    }

    const sql = "SELECT id, name, email, role FROM users WHERE id = ?";
    db.query(sql, [requestedId], (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération de l'utilisateur :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }

        if (results.length === 0) {
            console.log("⚠️ Aucun utilisateur trouvé avec cet ID :", requestedId);
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        console.log("✅ Utilisateur trouvé :", results[0]);
        res.json(results[0]);
    });
};

// ✅ Mise à jour du profil utilisateur (Uniquement si admin ou utilisateur lui-même)
exports.updateUserProfile = (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;

    if (Number(req.user.id) !== Number(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ message: "⛔ Accès interdit." });
    }

    let sql = "UPDATE users SET ";
    let values = [];
    if (name) {
        sql += "name = ?, ";
        values.push(name);
    }
    if (email) {
        sql += "email = ?, ";
        values.push(email);
    }
    sql = sql.slice(0, -2);
    sql += " WHERE id = ?";
    values.push(userId);

    db.query(sql, values, (err) => {
        if (err) {
            console.error("❌ Erreur lors de la mise à jour :", err);
        }
        res.json({ message: "Profil mis à jour avec succès !" });
    });
};

// ✅ Suppression du compte utilisateur (Uniquement si admin ou utilisateur lui-même)
exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    if (Number(req.user.id) !== Number(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ message: "⛔ Accès interdit." });
    }

    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [userId], (err) => {
        if (err) {
            console.error("❌ Erreur lors de la suppression :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        res.json({ message: "Utilisateur supprimé avec succès !" });
    });
};

// ✅ Récupération de tous les utilisateurs (Admin uniquement)
exports.getAllUsers = (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "⛔ Accès refusé." });
    }

    const sql = "SELECT id, name, email, role FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Erreur lors de la récupération des utilisateurs :", err);
            return res.status(500).json({ message: "Erreur serveur." });
        }
        res.json(results);
    });
};