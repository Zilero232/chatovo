import type { CallToneKind } from '../../config';

export type PlayCallToneInput = {
  kind: CallToneKind;
  volume: number;
};
