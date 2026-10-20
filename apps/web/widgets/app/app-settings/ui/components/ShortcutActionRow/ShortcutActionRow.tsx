'use client';

import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { formatBindingDisplay, ShortcutRow } from '@/entities/app/shortcut';
import { useShortcutConflict, useShortcutRecording } from '@/features/app/shortcuts';

import type { ShortcutActionRowProps } from './ShortcutActionRow.types';

export const ShortcutActionRow = ({ actionId }: ShortcutActionRowProps) => {
  const t = useTranslations('settings.shortcuts');
  const tActions = useTranslations('settings.shortcuts.actions');
  const { settings, setGroup } = useAppSettings();

  const bindings = settings.shortcuts;
  const binding = bindings[actionId];

  const { recording, start } = useShortcutRecording({
    actionId,
    allBindings: bindings,
    onPatch: (patch) => setGroup('shortcuts', { ...bindings, ...patch })
  });

  const hasConflict = useShortcutConflict(binding);

  const display = formatBindingDisplay(recording, binding, {
    recording: t('recording'),
    unassigned: t('unassigned')
  });

  return (
    <ShortcutRow
      clearVisible={!isNullish(binding) && !recording}
      display={display}
      label={tActions(actionId)}
      recording={recording}
      showConflictHint={hasConflict && !recording}
      onClear={() => setGroup('shortcuts', { ...bindings, [actionId]: null })}
      onRecord={start}
    />
  );
};
