require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const userRoutes = require('./routes/userRoutes');
const tableRoutes = require('./routes/tableRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Vérification des variables d'environnement requises
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    console.error("❌ Erreur : certaines variables d'environnement pour la BDD sont manquantes !");
    process.exit(1);
}

if (!process.env.DB_PORT) {
    console.warn("⚠ Attention : DB_PORT n'est pas défini, utilisation de la valeur par défaut 3306.");
}

// ✅ Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Logger toutes les requêtes
app.use((req, res, next) => {
    console.log(`➡ ${req.method} ${req.url}`);
    next();
});

// ✅ Connexion à la base de données (Pool MySQL)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Vérification initiale de la connexion MySQL
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erreur de connexion à MySQL :', err.message);
    } else {
        console.log('✅ Connexion réussie à MySQL !');
        connection.release();
    }
});

// ✅ Route pour tester la connexion à la base de données
app.get('/api/db-check', (req, res) => {
    db.query('SELECT 1', (err, results) => {
        if (err) {
            console.error("❌ Erreur de connexion à la BDD :", err);
            return res.status(500).json({ message: "Erreur de connexion à la BDD", error: err.message });
        }
        res.json({ message: "✅ Connexion à la BDD réussie !" });
    });
});

// ✅ Importation des routes principales
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tables', tableRoutes);

// ✅ Route de test du backend
app.get('/test', (req, res) => {
    res.json({ message: "✅ Le backend fonctionne bien !" });
});

// ✅ Middleware pour gérer les routes inexistantes
app.use((req, res) => {
    res.status(404).json({ message: "❌ Route non trouvée" });
});

// ✅ Middleware global pour la gestion des erreurs
app.use((err, req, res, next) => {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
});

// ✅ Démarrer le serveur avec gestion des erreurs
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
}).on('error', (err) => {
    console.error('❌ Erreur lors du démarrage du serveur :', err.message);
});
