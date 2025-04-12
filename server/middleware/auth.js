const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("📢 Requête reçue sur :", req.method, req.originalUrl);
    console.log("🛠️ En-têtes reçus :", req.headers); // Vérifie les en-têtes

    const authHeader = req.header('Authorization');
    console.log("🔍 Vérification du token...");

    if (!authHeader) {
        console.log("❌ Aucun token trouvé dans l'en-tête Authorization.");
        return res.status(401).json({ message: "⛔ Accès non autorisé, token manquant." });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("🔑 Token extrait :", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token décodé avec succès :", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ Erreur lors de la vérification du token :", err.message);
        return res.status(401).json({ message: "⛔ Token invalide." });
    }
};
