import { IconButtonWithTooltip, SearchField, Spinner } from '@chatovo/ui-kit';
import { X } from 'lucide-react';
import { useRef } from 'react';
import { useTranslations } from 'use-intl';

import type { MusicQueryFieldProps } from './MusicQueryField.types';

import s from './MusicQueryField.module.scss';

export const MusicQueryField = ({ field, isBusy, kind }: MusicQueryFieldProps) => {
  const t = useTranslations('room.music');

  const { value, query, setValue, clear, onSubmit } = field;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form className={s.root} role={kind === 'radio' ? 'search' : undefined} onSubmit={onSubmit}>
      <SearchField
        trail={
          <>
            {isBusy && <Spinner />}
            {value !== '' && (
              <IconButtonWithTooltip
                icon={<X />}
                label={t('search.clear')}
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
        aria-label={t(`fields.${kind}.label`)}
        autoComplete='off'
        className={s.field}
        enterKeyHint={query.kind === 'link' ? 'done' : 'search'}
        inputRef={inputRef}
        placeholder={t(`fields.${kind}.placeholder`)}
        spellCheck={false}
        value={value}
        onValueChange={setValue}
      />
    </form>
  );
};
