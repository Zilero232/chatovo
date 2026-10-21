import type { KeyboardEvent } from 'react';

import { ConfirmDialog, Text } from '@chatovo/ui-kit';
import { useMount, useTextareaAutosize } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import type { EditMessageDialogProps } from './EditMessageDialog.types';

import { normalizeMessage } from '../../../../../model/lib';

import s from './EditMessageDialog.module.scss';

export const EditMessageDialog = ({
  open,
  initialValue,
  onOpenChange,
  onSave
}: EditMessageDialogProps) => {
  const t = useTranslations('chat');
  const normalized = normalizeMessage(initialValue);
  const { ref, value, set } = useTextareaAutosize<HTMLTextAreaElement>(normalized);

  useMount(() => {
    const node = ref.current;

    if (node) {
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  });

  const save = () => {
    const next = value.trim();

    if (next.length === 0 || next === normalized) {
      onOpenChange(false);

      return;
    }

    onSave(next);
    onOpenChange(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      save();
    }
  };

  return (
    <ConfirmDialog
      cancelLabel={t('cancel')}
      confirmLabel={t('save')}
      confirmVariant='default'
      open={open}
      title={t('editTitle')}
      onConfirm={save}
      onOpenChange={onOpenChange}
    >
      <div className={s.root}>
        <textarea
          ref={ref}
          className={clsx(s.input, 'scrollbar-thin')}
          rows={1}
          value={value}
          onChange={(event) => set(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Text className={s.hint} tone='muted'>
          {t('editHint')}
        </Text>
      </div>
    </ConfirmDialog>
  );
};
