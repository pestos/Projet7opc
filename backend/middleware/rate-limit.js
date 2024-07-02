const rateLimit = require("express-rate-limit");

// Définir la configuration du rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
    message:
        "Trop de requêtes créées à partir de cette IP, veuillez réessayer après 15 minutes",
});

module.exports = {
    limiter,
};
