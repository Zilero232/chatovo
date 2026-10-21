import type { ShareOptionProps } from './ShareOption.types';

import s from './ShareOption.module.scss';

export const ShareOption = ({
  description,
  icon,
  isDisabled = false,
  title,
  onSelect
}: ShareOptionProps) => (
  <button className={s.root} disabled={isDisabled} type='button' onClick={onSelect}>
    <span aria-hidden className={s.icon}>
      {icon}
    </span>
    <span className={s.title}>{title}</span>
    <span className={s.description}>{description}</span>
  </button>
);
