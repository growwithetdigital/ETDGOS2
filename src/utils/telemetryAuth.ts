/**
 * Telemetry and Administrative Access Guard
 * Restricts macro telemetry, system tracking, and internal metrics
 * strictly to the platform owner / administrator (ericlamarthomas@gmail.com).
 * Clients and non-admin users must NEVER have access.
 */

export const ADMIN_EMAIL = 'ericlamarthomas@gmail.com';

export const AUTHORIZED_TELEMETRY_EMAILS = [ADMIN_EMAIL];

export const isAuthorizedForTelemetry = (
  userEmail?: string | null,
  profileEmail?: string | null
): boolean => {
  const normalizedUser = (userEmail || '').trim().toLowerCase();
  const normalizedProfile = (profileEmail || '').trim().toLowerCase();

  // If a user account email exists, it must strictly be the admin email
  if (normalizedUser) {
    return normalizedUser === ADMIN_EMAIL;
  }

  // Fallback to profile email only if authenticated user email is unavailable
  return normalizedProfile === ADMIN_EMAIL;
};
