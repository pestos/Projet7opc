const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single("image");

const processImage = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const name = req.file.originalname.split(" ").join("_").split(".")[0];
    const extension = MIME_TYPES[req.file.mimetype];
    const filename = name + Date.now() + "." + extension;
    const outputPath = path.join("images", filename);

    sharp(req.file.buffer)
        .resize(800) // redimensionner l'image à une largeur de 800px, ajustez selon vos besoins
        .toFormat(extension)
        .toFile(outputPath, (err, info) => {
            if (err) {
                return next(err);
            }
            req.file.filename = filename;
            next();
        });
};

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        processImage(req, res, next);
    });
};
