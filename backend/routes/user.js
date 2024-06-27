const express = require("express");
const router = express.Router();
const useCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/signup", useCtrl.signup);
router.post("/login", useCtrl.login);
module.exports = router;
