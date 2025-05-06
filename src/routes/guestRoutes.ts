import express from "express";
import {
  getHomePage,
  getArticle,
  getArticlesByTag,
} from "../controllers/articleController";

const router = express.Router();

// Home page - list of articles
router.get("/", getHomePage);

// view articles by tag
router.get("/tag/:tag", getArticlesByTag);

// view single article
router.get("/article/:slug", getArticle);

export default router;
