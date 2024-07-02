const Book = require("../models/books");
const fs = require("fs");
const path = require("path");

exports.booksGet = (req, res, next) => {
    Book.find()
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

exports.bookPost = (req, res, next) => {
    const parsedData = JSON.parse(req.body.book);
    const imageUrl = req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : null;
    const book = new Book({
        ...parsedData,
        userId: req.auth.userId,
        imageUrl: imageUrl,
    });
    book.save()
        .then(() => res.status(201).json({ message: "livre crée" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.bookGetId = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

exports.bookIdDelete = async (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(403).json({ message: "Forbidden" });
            } else {
                const filename = thing.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(204).json({
                                message: "Objet supprimé !",
                            });
                        })
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.bookModifyId = (req, res, next) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };

    delete bookObject._userId;

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: "Livre non trouvé" });
            }
            if (book.userId != req.auth.userId) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const oldImageUrl = book.imageUrl;
            if (req.file && oldImageUrl) {
                const oldImageFilename = path.basename(oldImageUrl);
                const oldImagePath = path.join(
                    __dirname,
                    "..",
                    "images",
                    oldImageFilename
                );

                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error(
                            `Erreur lors de la suppression de l'ancienne image : ${err}`
                        );
                    }
                });
            }

            Book.updateOne(
                { _id: req.params.id },
                { ...bookObject, _id: req.params.id }
            )
                .then(() => res.status(200).json({ message: "Objet modifié!" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.bookRatingPost = (req, res, next) => {
    const bookId = req.params.id;
    const userId = req.body.userId;
    const grade = req.body.rating;

    Book.findById(bookId)
        .then((book) => {
            if (!book) {
                return res.status(404).send({ message: "Livre non trouvé" });
            }

            const existingRating = book.ratings.find(
                (rating) => rating.userId.toString() === userId
            );

            if (existingRating) {
                return res
                    .status(400)
                    .json({ message: "Vous avez déjà voté pour ce livre" });
            }

            // Ajoute un nouveau vote
            book.ratings.push({ userId, grade });

            // Calculer la nouvelle moyenne des notes
            const sum = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
            let averageRating =
                book.ratings.length > 0 ? sum / book.ratings.length : 0;

            // Appliquer floor ou ceil en fonction de la moyenne
            averageRating =
                averageRating < 5
                    ? Math.floor(averageRating)
                    : Math.ceil(averageRating);

            book.averageRating = averageRating;

            return book.save();
        })
        .then((book) => res.status(200).json(book))
        .catch((error) =>
            res.status(500).json({
                message: "Erreur lors de l'enregistrement du vote",
                error,
            })
        );
};

exports.bookRating = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((bestBooks) => res.status(200).json(bestBooks))
        .catch((error) => res.status(400).json({ error }));
};
