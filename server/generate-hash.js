const bcrypt = require('bcryptjs');

const password = "admin123"; // 🔥 Mets le mot de passe que tu veux hasher

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error("❌ Erreur bcrypt :", err);
    } else {
        console.log("🔑 Nouveau hash généré :", hash);
    }
});
