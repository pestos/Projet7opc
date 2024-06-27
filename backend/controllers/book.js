const Book = require("../models/books");
const fs = require("fs");

exports.booksGet = (req, res, next) => {
    Book.find()
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

exports.bookPost = (req, res, next) => {
    console.log(req.body);
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
                res.status(401).json({ message: "Not authorized" });
            } else {
                const filename = thing.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: "Objet supprimé !",
                            });
                        })
                        .catch((error) => res.status(401).json({ error }));
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
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: "Objet modifié!" })
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};
