import "express-session";

//Add additional type definitions for session
declare module "express-session" {
  interface Session {
    isAuthenticated: boolean;
    username?: string;
  }
}
