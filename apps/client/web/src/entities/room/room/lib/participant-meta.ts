import { participantMetadataSchema, safeJsonParse } from '@chatovo/schemas';

export const readParticipantMeta = (metadata: string | undefined) =>
  participantMetadataSchema.parse(safeJsonParse(metadata));
