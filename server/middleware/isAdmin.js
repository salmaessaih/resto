module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "⛔ Accès refusé. Admin requis." });
    }

    console.log("✅ Accès admin autorisé.");
    next();
};