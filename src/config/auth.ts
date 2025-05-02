import bcrypt from "bcrypt";

export const ADMIN_USERNAME = "admin";

// store hashed password
const ADMIN_PASSWORD_HASH =
  "$2b$10$5dwsS5snIRlKu8ka5r7z0ughUP5JnCR0GcQsP.iWupW1zeGH47hD6"; // 'adminpass'

/**
 * Verify admin credentials
 */

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  if (username !== ADMIN_USERNAME) {
    return false;
  }

  return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

/**
 * Generate a new password hash (utility function for setting up new passwords)
 */
export async function generatePasswordHash(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
