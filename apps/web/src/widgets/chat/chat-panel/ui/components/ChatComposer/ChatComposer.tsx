import { Button, Spinner } from '@chatovo/ui-kit';
import { useKeyboard, useTextareaAutosize } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Paperclip, SendHorizontal } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { ChatComposerProps } from './ChatComposer.types';

import s from './ChatComposer.module.scss';

export const ChatComposer = ({ isUploading, onSend, onAttach, onPaste }: ChatComposerProps) => {
  const t = useTranslations('chat');
  const { ref, value: draft, set, clear } = useTextareaAutosize<HTMLTextAreaElement>('');

  const busy = isUploading;

  const submit = async () => {
    const value = draft.trim();

    if (!value || busy) {
      return;
    }

    clear();
    ref.current?.focus();

    await onSend(value);
  };

  useKeyboard(ref, (event) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    submit();
  });

  const canSend = draft.trim().length > 0 && !busy;

  return (
    <form
      className={clsx('surface-bar', s.root)}
      onSubmit={(event) => {
        event.preventDefault();

        submit();
      }}
    >
      <span aria-hidden className='accent-top-line' />
      <Button
        aria-label={t('attach')}
        disabled={busy}
        size='icon-sm'
        type='button'
        variant='ghost'
        onClick={onAttach}
      >
        {isUploading ? <Spinner /> : <Paperclip />}
      </Button>

      <textarea
        ref={ref}
        className={clsx(s.input, 'scrollbar-none')}
        placeholder={isUploading ? t('uploading') : t('messagePlaceholder')}
        rows={1}
        value={draft}
        onChange={(event) => set(event.target.value)}
        onPaste={onPaste}
      />

      <Button
        aria-label={t('send')}
        className={clsx({ [s.sendActive]: canSend })}
        disabled={!canSend}
        size='icon-sm'
        type='submit'
      >
        <SendHorizontal className={clsx({ [s.sendIconActive]: canSend })} />
      </Button>
    </form>
  );
};
