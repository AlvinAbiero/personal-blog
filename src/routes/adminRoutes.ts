import express from "express";
import {
  getDashboard,
  getAddArticlePage,
  addArticle,
  getEditArticlePage,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController";
import { getLoginPage, login, logout } from "../controllers/authController";
import {
  ensureAuthenticated,
  ensureNotAuthenticated,
} from "../middleware/auth";

const router = express.Router();

// Authentication routes
router.get("/login", ensureNotAuthenticated, getLoginPage);
router.post("/login", ensureNotAuthenticated, login);
router.get("/logout", logout);

// Admin dashboard
router.get("/dashboard", ensureAuthenticated, getDashboard);

// Article management routes
router.get("/articles/add", ensureAuthenticated, getAddArticlePage);
router.post("/articles/add", ensureAuthenticated, addArticle);
router.get("/articles/edit/:id", ensureAuthenticated, getEditArticlePage);
router.put("/articles/edit/:id", ensureAuthenticated, updateArticle);
router.delete("/articles/delete/:id", ensureAuthenticated, deleteArticle);

export default router;
