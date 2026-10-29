import type { FormattedString } from '@grammyjs/parse-mode';

import { bold, fmt, link } from '@grammyjs/parse-mode';
import { isNonNullish, sortBy } from 'remeda';

import type { VoiceAttendee, VoicePresence, VoiceTrack } from '../../telegram.types';
import type { DescribeAttendeeInput, FormatVoiceSessionInput } from './format-voice-session.types';

import { VOICE_ELAPSED_STEP_MS, VOICE_MAX_LISTED_NAMES } from '../../config';
import { formatVoiceDuration } from '../format-voice-duration';

const listLines = (lines: string[]): string => {
  const shown = lines.slice(0, VOICE_MAX_LISTED_NAMES);
  const hidden = lines.length - shown.length;

  return hidden > 0 ? [...shown, `и ещё ${hidden}`].join('\n') : shown.join('\n');
};

const describeAudio = ({ deafened, micMuted }: VoicePresence): string | null => {
  if (deafened) {
    return '🔕';
  }

  return micMuted ? '🔇' : null;
};

const describePresence = (presence: VoicePresence | undefined): string => {
  if (!presence) {
    return '';
  }

  const { activity } = presence;
  const markers = [describeAudio(presence), activity ? `🎮 ${activity}` : null].filter(
    isNonNullish
  );

  return markers.length > 0 ? ` · ${markers.join(' ')}` : '';
};

const describeAttendee = ({ attendee, presence }: DescribeAttendeeInput): string =>
  `• ${attendee.name}${describePresence(presence)}`;

const describeTrack = ({ artist, title }: VoiceTrack): string =>
  artist ? `🎵 ${artist} — ${title}` : `🎵 ${title}`;

const describeElapsed = (elapsedMs: number): string => {
  if (elapsedMs < VOICE_ELAPSED_STEP_MS) {
    return 'только начали';
  }

  const rounded = Math.floor(elapsedMs / VOICE_ELAPSED_STEP_MS) * VOICE_ELAPSED_STEP_MS;

  return `идёт ${formatVoiceDuration(rounded)}`;
};

const describeStay = (attendee: VoiceAttendee): string =>
  `• ${attendee.name} — ${formatVoiceDuration(attendee.totalMs)}`;

export const formatVoiceSession = ({
  session,
  snapshot,
  url,
  now,
  isOver
}: FormatVoiceSessionInput): FormattedString => {
  const { attendees, peakCount, presentIds, roomName, startedAt } = session;
  const title = fmt`${link(url)}${bold()}${roomName}${bold()}${link(url)}`;

  if (isOver) {
    const duration = formatVoiceDuration(now - startedAt);
    const stays = sortBy(attendees, [(attendee) => attendee.totalMs, 'desc']).map(describeStay);

    return fmt`🔇 Голосовой канал ${title} опустел · ${duration}\nМаксимум одновременно: ${peakCount}\nБыли (${attendees.length}):\n${listLines(stays)}`;
  }

  const header = fmt`🔊 Голосовой канал ${title} · ${describeElapsed(now - startedAt)}`;
  const present = presentIds
    .map((id) => attendees.find((attendee) => attendee.id === id))
    .filter(isNonNullish);

  if (present.length === 0) {
    return fmt`${header}\nСейчас в канале никого`;
  }

  const lines = present.map((attendee) =>
    describeAttendee({ attendee, presence: snapshot.presence[attendee.id] })
  );
  const music = snapshot.track ? `\n${describeTrack(snapshot.track)}` : '';

  return fmt`${header}\nСейчас в канале (${present.length}):\n${listLines(lines)}${music}`;
};
