import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err.stack);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).render("error", {
    title: "Error",
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
    stack: process.env.NODE_ENV === "development" ? err.stack : "",
  });
}
