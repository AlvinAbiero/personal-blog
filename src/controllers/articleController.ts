import { Request, Response } from "express";
import { ArticleModel } from "../models/article";
import { marked } from "marked";
import { ArticleCreateInput, ArticleUpdateInput } from "../types/article";

// Guest controllers

/**
 * Display home page with a list of articles
 */
export async function getHomePage(req: Request, res: Response): Promise<void> {
  try {
    const articles = await ArticleModel.findAll();
    const featuredArticles = await ArticleModel.getFeatured();

    // Extract all unique tags from articles
    const allTags = Array.from(
      new Set(articles.flatMap((article) => article.tags))
    ).sort();

    res.render("guest/home", {
      title: "Personal Blog",
      articles,
      featuredArticles,
      allTags,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    req.flash("error_msg", "Error loading articles");
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load articles",
    });
  }
}

/**
 * Display a single article
 */
export async function getArticle(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const article = await ArticleModel.findBySlug(slug);

    if (!article) {
      res.status(404).render("error", {
        title: "Not Found",
        message: "Article not found",
      });
      return;
    }

    // Parse markdown content to HTML
    const contentHtml = marked(article.content);

    res.render("guest/article", {
      title: article.title,
      article,
      contentHtml,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    req.flash("error_msg", "Error loading article");
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load article",
    });
  }
}

/**
 * Display articles by tag
 */
export async function getArticlesByTag(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { tag } = req.params;
    const articles = await ArticleModel.findByTag(tag);

    res.render("guest/tag", {
      title: `Articles tagged with "${tag}"`,
      tag,
      articles,
    });
  } catch (error) {
    console.error("Error fetching articles by tag:", error);
    req.flash("error_msg", "Error loading articles");
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load articles",
    });
  }
}

// Admin Controllers

/**
 * Display admin dashboard with articles
 */
export async function getDashboard(req: Request, res: Response): Promise<void> {
  try {
    const articles = await ArticleModel.findAll();

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      articles,
      username: req.session.username,
    });
  } catch (error) {
    console.error("Error fetching articles for dashboard:", error);
    req.flash("error_msg", "Error loading dashboard");
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load dashboard",
    });
  }
}

/**
 * Display add article form
 */
export function getAddArticlePage(req: Request, res: Response): void {
  res.render("admin/addArticle", {
    title: "Add New Article",
  });
}

/**
 * Process add article form
 */
export async function addArticle(req: Request, res: Response): Promise<void> {
  try {
    const { title, content, tags } = req.body;
    const featured = req.body.featured === "on";

    if (!title || !content) {
      req.flash("error_msg", "Title and content are required");
      res.redirect("/admin/articles/add");
      return;
    }

    const articleData: ArticleCreateInput = {
      title,
      content,
      tags,
      featured,
    };

    await ArticleModel.create(articleData);

    req.flash("success_msg", "Article added successfully");
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error adding article:", error);
    req.flash("error_msg", "Error adding article");
    res.redirect("/admin/articles/add");
  }
}

/**
 * Display edit article form
 */
export async function getEditArticlePage(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findById(id);

    if (!article) {
      req.flash("error_msg", "Article not found");
      res.redirect("/admin/dashboard");
      return;
    }

    res.render("admin/editArticle", {
      title: "Edit Article",
      article,
      tagsString: article.tags.join(", "),
    });
  } catch (error) {
    console.error("Error fetching article for editing:", error);
    req.flash("error_msg", "Error loading article");
    res.redirect("/admin/dashboard");
  }
}

/**
 * Process edit article form
 */

export async function updateArticle(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const featured = req.body.featured === "on";

    if (!title || !content) {
      req.flash("error_msg", "Title and content are required");
      res.redirect(`/admin/articles/edit/${id}`);
      return;
    }

    const articleData: ArticleUpdateInput = {
      id,
      title,
      content,
      tags,
      featured,
    };

    const updatedArticle = await ArticleModel.update(articleData);

    if (!updatedArticle) {
      req.flash("error_msg", "Article not found");
      res.redirect("/admin/dashboard");
      return;
    }

    req.flash("success_msg", "Article updated successfully");
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error updating article:", error);
    req.flash("error_msg", "Error updating article");
    res.redirect(`/admin/dashboard`);
  }
}

/**
 * Process delete article
 */
export async function deleteArticle(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await ArticleModel.delete(id);

    if (deleted) {
      req.flash("success_msg", "Article deleted successfully");
    } else {
      req.flash("error_msg", "Article not found");
    }

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting article:", error);
    req.flash("error_msg", "Error deleting article");
    res.redirect("/admin/dashboard");
  }
}
