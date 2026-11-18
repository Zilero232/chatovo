import { useId } from 'react';

import type { SettingRowProps } from './SettingRow.types';

import s from '../../AppSettingsButton.module.scss';

export const SettingRow = ({ label, hint, control, stacked = false }: SettingRowProps) => {
  const labelId = useId();
  const hintId = useId();

  return (
    <div
      aria-describedby={hint ? hintId : undefined}
      aria-labelledby={labelId}
      className={stacked ? s.stackedRow : s.row}
      role='group'
    >
      <div className={s.rowText}>
        <span className={s.rowLabel} id={labelId}>
          {label}
        </span>
        {hint && (
          <span className={s.rowHint} id={hintId}>
            {hint}
          </span>
        )}
      </div>

      {control}
    </div>
  );
};
