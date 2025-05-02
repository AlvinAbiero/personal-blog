import { Request, Response, NextFunction } from "express";

/**
 * Middleware to ensure a user is authenticated
 */

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.session.isAuthenticated) {
    return next();
  }

  req.flash("error_msg", "Please log in to access this page");
  res.redirect("/admin/login");
}

/**
 * Middleware to ensure a user is not authenticated (for login page)
 */
export function ensureNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session.isAuthenticated) {
    return next();
  }

  res.redirect("/admin/dashboard");
}
