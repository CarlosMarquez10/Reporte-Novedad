import express from 'express';
import { login, logout } from '../controller/authController.js';

const router = express.Router();

router.get("/login", (req, res) => res.render("login", { user: req.session.user }));
router.post("/login", login);
router.get("/logout", logout);

export default router;
