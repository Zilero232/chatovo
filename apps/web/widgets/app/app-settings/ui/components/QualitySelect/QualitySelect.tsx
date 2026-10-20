import { Select } from '@chatovo/ui-kit';

import type { QualitySelectProps } from './QualitySelect.types';

export const QualitySelect = <T extends string>({
  value,
  options,
  onChange
}: QualitySelectProps<T>) => <Select options={options} value={value} onChange={onChange} />;
