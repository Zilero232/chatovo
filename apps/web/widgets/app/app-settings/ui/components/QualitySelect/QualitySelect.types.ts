import type { SelectOption } from '@chatovo/ui-kit';

export type QualitySelectProps<T extends string> = {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
};
