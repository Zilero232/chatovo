import type { ImageConfig, ImageSources, ResolveImageSourcesInput } from './Image.types';

const VIEWPORT_WIDTH_PATTERN = /(^|\s)(1?\d?\d)vw/g;

type Widths = {
  kind: 'w' | 'x';
  widths: number[];
};

const sortedSizes = ({ deviceSizes, imageSizes }: ImageConfig) => ({
  device: [...deviceSizes].sort((a, b) => a - b),
  all: [...deviceSizes, ...imageSizes].sort((a, b) => a - b)
});

const pickWidths = ({
  config,
  sizes,
  width
}: {
  config: ImageConfig;
  sizes?: string;
  width?: number;
}): Widths => {
  const { device, all } = sortedSizes(config);

  if (sizes) {
    const percents = [...sizes.matchAll(VIEWPORT_WIDTH_PATTERN)].map((match) =>
      Number.parseInt(match[2], 10)
    );

    if (percents.length === 0) {
      return { widths: all, kind: 'w' };
    }

    const smallestRatio = Math.min(...percents) * 0.01;

    return { widths: all.filter((size) => size >= device[0] * smallestRatio), kind: 'w' };
  }

  if (width === undefined) {
    return { widths: device, kind: 'w' };
  }

  const fitting = [width, width * 2].map(
    (target) => all.find((size) => size >= target) ?? all.at(-1)
  );

  return { widths: [...new Set(fitting)].filter((size) => size !== undefined), kind: 'x' };
};

const isInlineSource = (src: string) => src.startsWith('data:') || src.startsWith('blob:');

/** `src`, `srcSet` and `sizes` for an `<img>`, built the way `next/image` builds them from a loader. */
export const resolveImageSources = ({
  config,
  quality,
  sizes,
  src,
  unoptimized,
  width
}: ResolveImageSourcesInput): ImageSources => {
  if (!config || unoptimized || isInlineSource(src)) {
    return { src, sizes };
  }

  const { widths, kind } = pickWidths({ config, sizes, width });
  const { loader } = config;

  const srcSet = widths
    .map(
      (size, index) =>
        `${loader({ src, width: size, quality })} ${kind === 'w' ? size : index + 1}${kind}`
    )
    .join(', ');

  return {
    src: loader({ src, width: widths[widths.length - 1], quality }),
    srcSet,
    sizes: !sizes && kind === 'w' ? '100vw' : sizes
  };
};
