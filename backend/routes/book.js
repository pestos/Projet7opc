const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", bookCtrl.booksGet);
router.post("/", auth, multer, bookCtrl.bookPost);
router.get("/:id", bookCtrl.bookGetId);
router.delete("/:id", auth, bookCtrl.bookIdDelete);
router.put("/:id", auth, multer, bookCtrl.bookModifyId);
// router.get("/bestrating", bookCtrl.bookRating);

// router.post("books/:id/rating", auth, bookCtrl.bookIdPost);

module.exports = router;
