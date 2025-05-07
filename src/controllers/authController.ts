import { Request, Response } from "express";
import { verifyAdminCredentials } from "../config/auth";

/**
 * Display login page
 */

export function getLoginPage(req: Request, res: Response): void {
  res.render("admin/login", {
    title: "Admin Login",
    layout: "layouts/main",
  });
}

/**
 * Handle login form submission
 */
// export async function login(req: Request, res: Response): Promise<void> {
//   const { username, password } = req.body;

//   try {
//     const isValid = await verifyAdminCredentials(username, password);

//     if (isValid) {
//       req.session.isAuthenticated = true;
//       req.session.username = username; // Store the username in the session
//       req.flash("success_msg", "Login successful!");
//       res.redirect("/admin/dashboard"); // Redirect to the dashboard or another page after successful login
//     } else {
//       req.flash("error_msg", "Invalid username or password. Please try again.");
//       res.redirect("/admin/login"); // Redirect back to the login page on failure
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     req.flash(
//       "error_msg",
//       "An error occurred during login. Please try again later."
//     );
//     res.redirect("/admin/login"); // Redirect back to the login page on error
//   }
// }

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  try {
    console.log(
      `Login attempt - Username: ${username}, Password length: ${
        password ? password.length : 0
      }`
    );

    // Check username match separately to pinpoint the issue
    if (username !== "admin") {
      console.log("Username mismatch - entered:", username);
      req.flash("error_msg", "Invalid username or password. Please try again.");
      return res.redirect("/admin/login");
    }

    // Now check password
    const isPasswordValid = await verifyAdminCredentials("admin", password);
    console.log("Password validation result:", isPasswordValid);

    if (isPasswordValid) {
      req.session.isAuthenticated = true;
      req.session.username = username;
      req.flash("success_msg", "Login successful!");
      res.redirect("/admin/dashboard");
    } else {
      req.flash("error_msg", "Invalid username or password. Please try again.");
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash(
      "error_msg",
      "An error occurred during login. Please try again later."
    );
    res.redirect("/admin/login");
  }
}

/**
 * Handle logout
 */
export function logout(req: Request, res: Response): void {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }

    res.redirect("/");
  });
}
