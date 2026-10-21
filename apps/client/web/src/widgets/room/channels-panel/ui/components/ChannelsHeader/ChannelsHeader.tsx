import { BrandMark } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import s from './ChannelsHeader.module.scss';

export const ChannelsHeader = () => (
  <div className={clsx(s.root, 'surface-bar')}>
    <span aria-hidden className='accent-top-line' />
    <div className={s.titleGroup}>
      <BrandMark size={24} />
      <span className={s.title}>Chatovo</span>
    </div>
  </div>
);
