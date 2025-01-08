import express from "express";
import { allMessages, sendMessage } from "../Controllers/messageController.js";
import auth from "../Middleware/auth.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:id", auth, allMessages);

export default router;
