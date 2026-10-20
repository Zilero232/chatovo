import { IconButtonWithTooltip, SearchField, Spinner } from '@chatovo/ui-kit';
import { X } from 'lucide-react';
import { useRef } from 'react';
import { useTranslations } from 'use-intl';

import type { MusicSearchProps } from './MusicSearchField.types';

import s from './MusicSearchField.module.scss';

export const MusicSearchField = ({ search }: MusicSearchProps) => {
  const t = useTranslations('room.music.search');

  const { value, query, isSearching, setValue, clear, onSubmit } = search;

  const inputRef = useRef<HTMLInputElement>(null);

  const isBusy = query.kind === 'search' && isSearching;

  return (
    <form className={s.root} role='search' onSubmit={onSubmit}>
      <SearchField
        trail={
          <>
            {isBusy && <Spinner />}
            {value !== '' && (
              <IconButtonWithTooltip
                icon={<X />}
                label={t('clear')}
                size='icon-xs'
                tooltipSide='left'
                onClick={() => {
                  clear();
                  inputRef.current?.focus();
                }}
              />
            )}
          </>
        }
        aria-label={t('label')}
        autoComplete='off'
        className={s.field}
        enterKeyHint={query.kind === 'link' ? 'done' : 'search'}
        inputRef={inputRef}
        placeholder={t('placeholder')}
        spellCheck={false}
        value={value}
        onValueChange={setValue}
      />
      <p className={s.hint}>{t('hint')}</p>
    </form>
  );
};
