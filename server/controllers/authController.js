const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role = "user" } = req.body; // 👈 Rôle par défaut : "user"

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires." });
        }

        User.findByEmail(email, async (err, results) => {
            if (err) {
                console.error("❌ Erreur lors de la vérification de l'email :", err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            User.create({ name, email, password: hashedPassword, role }, (err, result) => {
                if (err) {
                    console.error("❌ Erreur lors de la création de l'utilisateur :", err);
                    return res.status(500).json({ message: 'Erreur serveur' });
                }
                res.status(201).json({ message: 'Utilisateur créé avec succès', userId: result.insertId });
            });
        });
    } catch (err) {
        console.error("❌ Erreur globale dans register :", err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.login = async (req, res) => {
    try {
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

            // Renvoyer toutes les informations nécessaires de l'utilisateur
            res.json({
                message: "Connexion réussie !",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        });
    } catch (err) {
        console.error("❌ Erreur globale dans login :", err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};