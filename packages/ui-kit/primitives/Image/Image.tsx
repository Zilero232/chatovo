'use client';

import type { CSSProperties, SyntheticEvent } from 'react';

import { useState } from 'react';

import type { ImageProps } from './Image.types';

import { blurPlaceholderStyle } from './blur-placeholder';
import { useImageConfig } from './image-config-context';
import { resolveImageSources } from './resolve-image-sources';

const FILL_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%'
};

/** A framework-agnostic `next/image`: lazy by default, `srcSet` from the `ImageConfigProvider` loader, optional blur placeholder. */
export const Image = ({
  alt,
  blurDataURL,
  fill = false,
  height,
  placeholder = 'empty',
  priority = false,
  quality,
  sizes,
  src,
  unoptimized,
  width,
  style,
  onLoad,
  ...props
}: ImageProps) => {
  const config = useImageConfig();

  const [isLoaded, setIsLoaded] = useState(false);

  const sources = resolveImageSources({ config, quality, sizes, src, unoptimized, width });
  const showBlur = placeholder === 'blur' && Boolean(blurDataURL) && !isLoaded;

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  return (
    <img
      style={{
        color: 'transparent',
        ...(fill && FILL_STYLE),
        ...(showBlur && blurDataURL && blurPlaceholderStyle({ blurDataURL, height, width })),
        ...style
      }}
      alt={alt}
      decoding='async'
      fetchPriority={priority ? 'high' : undefined}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sources.sizes}
      src={sources.src}
      srcSet={sources.srcSet}
      width={fill ? undefined : width}
      onLoad={handleLoad}
      {...props}
    />
  );
};
