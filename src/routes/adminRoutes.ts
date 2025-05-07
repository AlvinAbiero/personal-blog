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

// Add this to your adminRoutes.ts file temporarily

import { verifyAdminCredentials } from "../config/auth";

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

// Add this route for debugging
router.get("/debug-auth", async (req, res) => {
  try {
    const testUsername = "admin";
    const testPassword = "adminpass";

    const isValid = await verifyAdminCredentials(testUsername, testPassword);

    res.json({
      usernameCorrect: testUsername === "admin",
      passwordValid: isValid,
      testUsername,
      expectedUsername: "admin",
    });
  } catch (error) {
    const err = error as Error;
    console.error("Auth debug error:", error);
    res
      .status(500)
      .json({ error: "Authentication debug failed", message: err.message });
  }
});

export default router;
