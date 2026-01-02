import express from "express";
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
