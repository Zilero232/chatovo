'use client';

import type { ShortcutRowProps } from './ShortcutRow.types';

import { ShortcutClearButton, ShortcutComboButton } from './components';

import s from './ShortcutRow.module.scss';

export const ShortcutRow = ({
  label,
  display,
  recording,
  showConflictHint,
  clearVisible,
  onRecord,
  onClear
}: ShortcutRowProps) => (
  <div className={s.root}>
    <span className={s.label}>{label}</span>

    <div className={s.controls}>
      <ShortcutComboButton
        display={display}
        label={label}
        recording={recording}
        showConflictHint={showConflictHint}
        onClick={onRecord}
      />

      <ShortcutClearButton visible={clearVisible} onClick={onClear} />
    </div>
  </div>
);
