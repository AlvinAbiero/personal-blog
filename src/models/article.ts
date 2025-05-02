import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import {
  Article,
  ArticleCreateInput,
  ArticleUpdateInput,
} from "../types/article";

import {
  readJsonFile,
  writeJsonFile,
  deleteFile,
  listFiles,
  getArticleFilePath,
  getArticlesDirectory,
} from "../utils/fileUtils";

export class ArticleModel {
  /**
   * Create a new article
   */

  static async create(
    articleData: ArticleCreateInput
  ): Promise<Article | null> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      const slug = slugify(articleData.title, { lower: true, strict: true });

      // Extract an excerpt from the article content (first 150 characters)
      const excerpt =
        articleData.content
          .replace(/<[^>]+>/g, "") // Remove HTML tags
          .substring(0, 150)
          .trim() + "...";

      // Process tags
      const tags = articleData.tags
        ? articleData.tags.split(",").map((tag) => tag.trim())
        : [];

      const article: Article = {
        id,
        title: articleData.title,
        content: articleData.content,
        createdAt: now,
        updatedAt: now,
        slug,
        excerpt,
        featured: articleData.featured || false,
        tags,
      };

      const filePath = getArticleFilePath(id);
      await writeJsonFile(filePath, article);

      return article;
    } catch (error) {
      console.error("Error creating article:", error);
      return null;
    }
  }

  /**
   * Get all articles
   */
  static async findAll(): Promise<Article[]> {
    try {
      const articlesDir = getArticlesDirectory();
      const files = await listFiles(articlesDir);

      const articles: Article[] = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          const filePath = `${articlesDir}/${file}`;
          try {
            const article = await readJsonFile<Article>(filePath);
            articles.push(article);
          } catch (error) {
            console.error(`Error reading file ${file}:`, error);
          }
        }
      }

      // sort articles by createdAt date in descending order
      return articles.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error finding all articles:", error);
      return [];
    }
  }

  /**
   * Get an article by ID
   */
  static async findById(id: string): Promise<Article | null> {
    try {
      const filePath = getArticleFilePath(id);
      const article = await readJsonFile<Article>(filePath);
      return article;
    } catch (error) {
      console.error(`Error finding article by ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Update an article by slug
   */
  static async findBySlug(slug: string): Promise<Article | null> {
    try {
      const articles = await this.findAll();
      const article = articles.find((article) => article.slug === slug);
      return article || null;
    } catch (error) {
      console.error("Error finding article by slug:", error);
      return null;
    }
  }

  /**
   * Update an article
   */

  static async update(
    articleData: ArticleUpdateInput
  ): Promise<Article | null> {
    try {
      const filePath = getArticleFilePath(articleData.id);
      const existingArticle = await readJsonFile<Article>(filePath);

      // process tags
      const tags = articleData.tags
        ? articleData.tags.split(",").map((tag) => tag.trim())
        : [];

      // Generate a new slug if the title has changed
      const slug =
        existingArticle.title !== articleData.title
          ? slugify(articleData.title, { lower: true, strict: true })
          : existingArticle.slug;

      // Extract a new excerpt if the content has changed
      const excerpt =
        articleData.content !== existingArticle.content
          ? articleData.content
              .replace(/<[^>]+>/g, "")
              .substring(0, 150)
              .trim() + "..."
          : existingArticle.excerpt;

      const updatedArticle: Article = {
        ...existingArticle,
        title: articleData.title,
        content: articleData.content,
        updatedAt: new Date().toISOString(),
        slug,
        excerpt,
        featured: articleData.featured || false,
        tags,
      };

      await writeJsonFile(filePath, updatedArticle);
      return updatedArticle;
    } catch (error) {
      console.error("Error updating article:", error);
      return null;
    }
  }

  /**
   * Delete an article
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const filePath = getArticleFilePath(id);
      await deleteFile(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get featured articles
   */
  static async getFeatured(limit: number = 3): Promise<Article[]> {
    try {
      const articles = await this.findAll();
      const featuredArticles = articles.filter((article) => article.featured);
      return featuredArticles.slice(0, limit);
    } catch (error) {
      console.error("Error getting featured articles:", error);
      return [];
    }
  }

  /**
   * Get articles by tag
   */
  static async findByTag(tag: string): Promise<Article[]> {
    try {
      const articles = await this.findAll();
      const filteredArticles = articles.filter((article) =>
        article.tags.includes(tag)
      );
      return filteredArticles;
      //  return articles.filter((article) =>
      //    article.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      //  );
    } catch (error) {
      console.error("Error finding articles by tag:", error);
      return [];
    }
  }
}
