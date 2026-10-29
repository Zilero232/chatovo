// The better-auth admin plugin mounts its own role, ban and impersonation API.
// Roles and blocks go only through /moderation, which enforces the hierarchy, so
// every plugin route is switched off; the plugin stays for its ban fields.
export const DISABLED_AUTH_PATHS = [
  '/admin/ban-user',
  '/admin/create-user',
  '/admin/get-user',
  '/admin/has-permission',
  '/admin/impersonate-user',
  '/admin/list-user-sessions',
  '/admin/list-users',
  '/admin/remove-user',
  '/admin/revoke-user-session',
  '/admin/revoke-user-sessions',
  '/admin/set-role',
  '/admin/set-user-password',
  '/admin/stop-impersonating',
  '/admin/unban-user',
  '/admin/update-user'
];
