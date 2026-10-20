'use client';

import { clsx } from 'clsx';

import type { AvatarFallbackProps, AvatarImageProps, AvatarProps } from './Avatar.types';

import { Image } from '../Image';

import s from './Avatar.module.scss';

const AVATAR_IMAGE = { size: 96, defaultSizes: '40px' };

const Avatar = ({ className, size = 'default', ...props }: AvatarProps) => (
  <span className={clsx(s.root, className)} data-size={size} data-slot='avatar' {...props} />
);

const AvatarImage = ({
  className,
  alt = '',
  sizes = AVATAR_IMAGE.defaultSizes,
  ...props
}: AvatarImageProps) => (
  <Image
    alt={alt}
    className={clsx(s.image, className)}
    data-slot='avatar-image'
    height={AVATAR_IMAGE.size}
    sizes={sizes}
    width={AVATAR_IMAGE.size}
    {...props}
  />
);

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => (
  <span className={clsx(s.fallback, className)} data-slot='avatar-fallback' {...props} />
);

export { Avatar, AvatarFallback, AvatarImage };
