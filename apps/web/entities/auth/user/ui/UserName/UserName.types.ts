export type UserNameSize = 'md' | 'sm';

export type UserNameProps = {
  className?: string;
  developer?: boolean;
  name: string;
  profileUrl?: string | null;
  size?: UserNameSize;
  verified?: boolean;
};
