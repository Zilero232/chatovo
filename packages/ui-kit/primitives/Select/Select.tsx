'use client';

import { Select as BaseSelect } from '@base-ui/react/select';
import { clsx } from 'clsx';
import { Check, ChevronDown } from 'lucide-react';
import { isNullish } from 'remeda';

import type { SelectProps } from './Select.types';

import s from './Select.module.scss';

export const Select = <T extends string>({
  value,
  options,
  placeholder,
  isDisabled,
  className,
  menuClassName,
  'aria-label': ariaLabel,
  onChange
}: SelectProps<T>) => {
  const handleChange = (next: unknown) => {
    if (isNullish(next) || next === '') {
      return;
    }

    onChange(String(next) as T);
  };

  return (
    <BaseSelect.Root disabled={isDisabled} value={value ?? ''} onValueChange={handleChange}>
      <BaseSelect.Trigger
        aria-label={ariaLabel}
        className={clsx(s.trigger, className)}
        data-placeholder={isNullish(value) ? '' : undefined}
        data-slot='select-trigger'
      >
        <BaseSelect.Value className={s.value}>
          {(selected: T | null) =>
            options.find((option) => option.value === selected)?.label ?? placeholder
          }
        </BaseSelect.Value>
        <ChevronDown aria-hidden className={s.chevron} />
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner alignItemWithTrigger={false} className={s.positioner} sideOffset={4}>
          <BaseSelect.Popup
            className={clsx('glass-overlay', s.popup, menuClassName)}
            data-slot='select-content'
          >
            <BaseSelect.List className={s.list}>
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  className={s.item}
                  disabled={option.isDisabled}
                  value={option.value}
                >
                  {option.icon}
                  <BaseSelect.ItemText className={s.itemLabel}>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className={s.check}>
                    <Check aria-hidden />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
};
