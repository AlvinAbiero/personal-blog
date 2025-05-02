import "express-session";

//Add additional type definitions for session
declare module "express-session" {
  interface SessionData {
    isAuthenticated: boolean;
    username?: string;
  }
}
