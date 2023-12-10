const express = require("express");
const router = express.Router();
const controller = require("../Controllers/messageController");
const { auth } = require("../Middleware/auth");

router.post("/", auth, controller.sendMessage);
router.get("/:id", auth, controller.allMessages);

module.exports = router;
