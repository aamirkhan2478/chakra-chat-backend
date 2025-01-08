import express from "express";
import {
  accessChat,
  addToGroup,
  createGroup,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../Controllers/chatController.js";
import auth from "../Middleware/auth.js";

const router = express.Router();

router.post("/", auth, accessChat);
router.get("/", auth, fetchChats);
router.post("/group", auth, createGroup);
router.put("/rename", auth, renameGroup);
router.put("/groupadd", auth, addToGroup);
router.put("/groupremove", auth, removeFromGroup);

export default router;
