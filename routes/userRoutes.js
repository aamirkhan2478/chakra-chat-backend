import express from "express";
import {
  getUser,
  getUsers,
  login,
  signup,
} from "../Controllers/userController.js";
import auth from "../Middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/", auth, getUsers);
router.get("/getuser", auth, getUser);

export default router;
