import type { z } from 'zod';

import type { radioBrowserStationSchema } from './parse-radio-stations';

export type ParseRadioStationsInput = {
  body: string;
  maxTags: number;
  playableCodecs: ReadonlySet<string>;
};

export type ToRadioEntryInput = Omit<ParseRadioStationsInput, 'body'> & {
  raw: z.infer<typeof radioBrowserStationSchema>;
};
