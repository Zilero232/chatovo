import type { ComponentProps, ReactNode } from 'react';

export type ImageLoaderInput = {
  quality?: number;
  src: string;
  width: number;
};

export type ImageLoader = (input: ImageLoaderInput) => string;

export type ImageConfig = {
  deviceSizes: readonly number[];
  imageSizes: readonly number[];
  loader: ImageLoader;
};

export type ImageConfigProviderProps = {
  children: ReactNode;
  config: ImageConfig;
};

export type ImageProps = Omit<
  ComponentProps<'img'>,
  'alt' | 'height' | 'placeholder' | 'src' | 'srcSet' | 'width'
> & {
  alt: string;
  blurDataURL?: string;
  fill?: boolean;
  height?: number;
  placeholder?: 'blur' | 'empty';
  priority?: boolean;
  quality?: number;
  sizes?: string;
  src: string;
  unoptimized?: boolean;
  width?: number;
};

export type ResolveImageSourcesInput = {
  config: ImageConfig | null;
  quality?: number;
  sizes?: string;
  src: string;
  unoptimized?: boolean;
  width?: number;
};

export type ImageSources = {
  sizes?: string;
  src: string;
  srcSet?: string;
};
