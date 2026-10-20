'use client';

import { BrandMark } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import { LanguageSwitcher } from '@/widgets/app/language-switcher';

import type { ChannelsHeaderProps } from './ChannelsHeader.types';

import s from './ChannelsHeader.module.scss';

export const ChannelsHeader = ({ compact = false }: ChannelsHeaderProps = {}) => {
  if (compact) {
    return null;
  }

  return (
    <div className={clsx(s.root, 'surface-bar')}>
      <span aria-hidden className='accent-top-line' />
      <div className={s.titleGroup}>
        <BrandMark size={24} />
        <span className={s.title}>Chatovo</span>
      </div>

      <LanguageSwitcher />
    </div>
  );
};
