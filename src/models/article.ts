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

  static async create(articleData: ArticleCreateInput): Promise<Article> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const slug = slugify(articleData.title, { lower: true, strict: true });

    // Extract an excerpt from the article content (first 100 characters)
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
  }

  /**
   * Get all articles
   */
  static async getAll(): Promise<Article[]> {
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
  }
}
