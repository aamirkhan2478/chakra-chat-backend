const express = require("express");
const router = express.Router();
const controller = require("../Controllers/chatController");
const { auth } = require("../Middleware/auth");

router.post("/", auth, controller.accessChat);
router.get("/", auth, controller.fetchChats);
router.post('/group', auth, controller.createGroup);
router.put('/rename', auth, controller.renameGroup);
router.put('/groupadd', auth,controller.addToGroup);
router.put('/groupremove', auth, controller.removeFromGroup);
module.exports = router;
