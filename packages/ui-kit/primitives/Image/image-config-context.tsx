'use client';

import { createContext, use } from 'react';

import type { ImageConfig, ImageConfigProviderProps } from './Image.types';

const ImageConfigContext = createContext<ImageConfig | null>(null);

/** Gives every `Image` below it a loader and the allowed widths; without one, images load their `src` as is. */
export const ImageConfigProvider = ({ children, config }: ImageConfigProviderProps) => (
  <ImageConfigContext value={config}>{children}</ImageConfigContext>
);

export const useImageConfig = () => use(ImageConfigContext);
