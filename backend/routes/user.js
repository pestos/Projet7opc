const express = require("express");
const router = express.Router();
const useCtrl = require("../controllers/user");
const { limiter } = require("../middleware/rate-limit");

router.post("/signup", limiter, useCtrl.signup);
router.post("/login", limiter, useCtrl.login);
module.exports = router;
