import type { ChatCallLog } from '@chatovo/schemas';

export type DescribeCallLogInput = Pick<ChatCallLog, 'durationSec' | 'outcome'>;
