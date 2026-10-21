import { Button, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import type { SidebarItemProps } from './SidebarItem.types';

import s from './SidebarItem.module.scss';

export const SidebarItem = ({
  badge,
  icon,
  label,
  title,
  variant,
  className,
  ...buttonProps
}: SidebarItemProps) => {
  if (variant === 'menu') {
    return (
      <Button className={clsx(s.item, className)} variant='ghost' {...buttonProps}>
        {icon}
        <span className={s.title}>{title}</span>
        {badge}
      </Button>
    );
  }

  return (
    <Tooltip>
      <span className={s.anchor}>
        <Button
          aria-label={label}
          className={className}
          size='icon'
          variant='ghost'
          {...buttonProps}
        >
          {icon}
        </Button>
        {badge}
      </span>
      <TooltipContent side='right'>{title}</TooltipContent>
    </Tooltip>
  );
};
