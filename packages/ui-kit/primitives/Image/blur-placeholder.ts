import type { CSSProperties } from 'react';

const BLUR_DEVIATION = 20;

const blurSvg = ({
  blurDataURL,
  height,
  width
}: {
  blurDataURL: string;
  height?: number;
  width?: number;
}) => {
  const viewBox = width && height ? `viewBox='0 0 ${width} ${height}'` : '';
  const filter = `%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='${BLUR_DEVIATION}'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='${BLUR_DEVIATION}'/%3E%3C/filter%3E`;
  const image = `%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='none' style='filter: url(%23b);' href='${blurDataURL}'/%3E`;

  return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${viewBox}%3E${filter}${image}%3C/svg%3E`;
};

/** The blurred background `next/image` paints under an image until it loads. */
export const blurPlaceholderStyle = ({
  blurDataURL,
  height,
  width
}: {
  blurDataURL: string;
  height?: number;
  width?: number;
}): CSSProperties => ({
  backgroundImage: `url("data:image/svg+xml;charset=utf-8,${blurSvg({ blurDataURL, height, width })}")`,
  backgroundPosition: '50% 50%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
});
