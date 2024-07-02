const express = require('express');
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const mongoSanitize = require("mongo-sanitize");
app.use(express.json()); // Remplace app.use(bodyParser.json());
const path = require("path");
const cors = require("cors");
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
    cors({
        origin: "*", // Adaptez selon vos besoins spécifiques
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use((req, res, next) => {
    req.body = mongoSanitize(req.body);
    req.query = mongoSanitize(req.query);
    req.params = mongoSanitize(req.params);
    next();
});

mongoose
    .connect("mongodb+srv://Gfrederic:lolipop@cluster0.q9dbvmd.mongodb.net/", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
