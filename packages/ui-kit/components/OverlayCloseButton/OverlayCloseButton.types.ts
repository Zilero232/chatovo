import type { ComponentProps } from 'react';

export type OverlayCloseButtonProps = {
  className?: string;
  onClick?: () => void;
} & Pick<ComponentProps<'button'>, 'slot'>;
