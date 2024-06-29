export const ADMIN_ROLE_TYPE = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  GUEST: 'GUEST',
} as const;
export type ADMIN_ROLE_TYPE =
  (typeof ADMIN_ROLE_TYPE)[keyof typeof ADMIN_ROLE_TYPE];
