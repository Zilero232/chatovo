import { Popover, PopoverContent, PopoverTrigger } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Palette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useTranslations } from 'use-intl';

import type { BannerColorFieldProps } from './BannerColorField.types';

import s from '../../UpdateProfileForm.module.scss';

const PRESETS = ['#ff7a59', '#ffcf5c', '#a48bff', '#7ee0b5', '#ff6b78', '#6b5a78'];

export const BannerColorField = ({ value, onChange }: BannerColorFieldProps) => {
  const t = useTranslations('settings.profile');

  const isCustom = value !== null && !PRESETS.includes(value);
  const current = value ?? PRESETS[0];

  return (
    <div className={s.field}>
      <span className={s.label}>{t('bannerLabel')}</span>
      <span className={s.hint}>{t('bannerHint')}</span>

      <div className={s.bannerRow}>
        {PRESETS.map((color) => (
          <button
            key={color}
            aria-label={color}
            className={clsx(s.bannerSwatch, { [s.bannerSwatchActive]: value === color })}
            style={{ backgroundColor: color }}
            type='button'
            onClick={() => onChange(color)}
          />
        ))}

        <Popover>
          <PopoverTrigger
            aria-label={t('bannerCustom')}
            className={clsx(s.bannerCustomTrigger, { [s.bannerSwatchActive]: isCustom })}
            style={{ backgroundColor: isCustom ? current : undefined }}
            variant='ghost'
          >
            <Palette aria-hidden className={s.bannerCustomIcon} />
          </PopoverTrigger>
          <PopoverContent className={s.bannerPickerPopover}>
            <HexColorPicker color={current} onChange={onChange} />
          </PopoverContent>
        </Popover>
      </div>

      {value && (
        <button className={s.avatarRemove} type='button' onClick={() => onChange(null)}>
          {t('bannerReset')}
        </button>
      )}
    </div>
  );
};
