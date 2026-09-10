/**
 * Telemetry and Administrative Access Guard
 * Restricts macro telemetry, system tracking, and internal metrics
 * strictly to authorized administrator emails.
 */

export const AUTHORIZED_TELEMETRY_EMAILS = [
  'ericlamarthomas@gmail.com',
  'contactetdigital@gmail.com',
  'hello@growwithetdigital.com'
];

export const isAuthorizedForTelemetry = (
  userEmail?: string | null,
  profileEmail?: string | null
): boolean => {
  const e1 = (userEmail || '').trim().toLowerCase();
  const e2 = (profileEmail || '').trim().toLowerCase();
  return (
    AUTHORIZED_TELEMETRY_EMAILS.includes(e1) ||
    AUTHORIZED_TELEMETRY_EMAILS.includes(e2)
  );
};
