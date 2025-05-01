import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import morgan from "morgan";
import expressLayouts from "express-ejs-layouts";
import methodOverride from "method-override";
import { config } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import guestRoutes from "./routes/guestRoutes";
import adminRoutes from "./routes/adminRoutes";

// load environment variables
config();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");

// middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(methodOverride("_method"));

// session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Flash messages
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  next();
});

// routes
app.use("/", guestRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);

export default app;
