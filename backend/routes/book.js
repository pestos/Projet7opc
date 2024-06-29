const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", bookCtrl.booksGet);
router.post("/", auth, multer, bookCtrl.bookPost);
router.get("/bestrating", bookCtrl.bookRating);
router.get("/:id", bookCtrl.bookGetId);
router.delete("/:id", auth, bookCtrl.bookIdDelete);
router.put("/:id", auth, multer, bookCtrl.bookModifyId);
router.post("/:id/rating", auth, bookCtrl.bookRatingPost);


module.exports = router;
