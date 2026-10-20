export {
  changeEmailSchema,
  type ChangeEmailValues,
  changePasswordSchema,
  type ChangePasswordValues,
  profileSchema,
  type ProfileValues,
  type UpdateProfileInput,
  useChangeEmail,
  useChangePassword,
  useCurrentUser,
  useDevelopers,
  useSendVerificationEmail,
  useUpdateProfile
} from './model/hooks';
export type { UserRole } from './model/types';
export { DeveloperBadge } from './ui/DeveloperBadge/DeveloperBadge';
export type { DeveloperBadgeProps } from './ui/DeveloperBadge/DeveloperBadge.types';
export { UserAvatar } from './ui/UserAvatar/UserAvatar';

export type { UserAvatarProps } from './ui/UserAvatar/UserAvatar.types';
export { UserName } from './ui/UserName/UserName';
export type { UserNameProps } from './ui/UserName/UserName.types';
