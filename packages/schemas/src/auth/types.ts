import type { z } from 'zod';

import type {
  changeEmailSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  permissionSchema,
  profileSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  userRoleSchema
} from './inputs';

export type UserRole = z.infer<typeof userRoleSchema>;
export type Permission = z.infer<typeof permissionSchema>;

export type HasPermissionInput = {
  permission: Permission;
  role: string | null | undefined;
};

export type RolePairInput = {
  actorRole: string | null | undefined;
  targetRole: string | null | undefined;
};

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
/** Form shape before validation — `acceptedTerms` starts out `false`. */
export type SignUpFormValues = z.input<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;

export type UpdateProfileInput = ProfileValues & {
  avatar?: File | null;
};
