const express = require("express");
const router = express.Router();
const controller = require("../Controllers/userController");
const { auth } = require("../Middleware/auth");

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.get("/", auth, controller.getUsers);
router.get("/getuser", auth, controller.getUser);

module.exports = router;
