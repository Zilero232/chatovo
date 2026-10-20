import type { ComponentProps } from 'react';

import type { ImageProps } from '../Image';

export type AvatarSize = 'default' | 'lg' | 'sm';

export type AvatarProps = ComponentProps<'span'> & {
  size?: AvatarSize;
};

export type AvatarImageProps = Omit<ImageProps, 'alt' | 'height' | 'width'> & {
  alt?: string;
};

export type AvatarFallbackProps = ComponentProps<'span'>;
