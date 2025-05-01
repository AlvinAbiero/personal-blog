export interface Article {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  slug: string;
  excerpt: string;
  featured: boolean;
  tags: string[];
}

export interface ArticleCreateInput {
  title: string;
  content: string;
  featured?: boolean;
  tags?: string;
}

export interface ArticleUpdateInput extends ArticleCreateInput {
  id: string;
}

// Add additional type definitions for session
declare module "express-session" {
  interface SessionData {
    isAuthenticated: boolean;
    username?: string;
  }
}
