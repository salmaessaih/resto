const bcrypt = require('bcryptjs');

const enteredPassword = "admin123"; // Remplace par le mot de passe que tu saisis
const hashedPassword = "$2b$10$X81u36POBBhvIUog3SadXe2xO5FSEfjYlp7LqsfWdkSwfcORqkeOu"; // Hash en base de données

bcrypt.compare(enteredPassword, hashedPassword, (err, isMatch) => {
    if (err) {
        console.error("❌ Erreur bcrypt :", err);
    } else {
        console.log("✅ Mot de passe correct :", isMatch);
    }
});
