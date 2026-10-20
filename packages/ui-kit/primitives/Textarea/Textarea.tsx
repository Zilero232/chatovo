import { clsx } from 'clsx';

import type { TextareaProps } from './Textarea.types';

import s from './Textarea.module.scss';

const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea className={clsx(s.root, className)} data-slot='textarea' {...props} />
);

export { Textarea };
