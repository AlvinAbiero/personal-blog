import bcrypt from "bcrypt";

export const ADMIN_USERNAME = "admin";

// Updated password hash that correctly matches "adminpass"
const ADMIN_PASSWORD_HASH =
  "$2b$10$2G9g0KU8KIGKHPnYd.0s2.fr3RIICF2e0UCl.BzZcr48SCpcOB7Ay"; // 'adminpass'

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
