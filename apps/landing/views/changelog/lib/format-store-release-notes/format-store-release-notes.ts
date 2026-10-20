import type { FormatStoreReleaseNotesInput } from './format-store-release-notes.types';

export const formatStoreReleaseNotes = ({
  titles,
  limit
}: FormatStoreReleaseNotesInput): string => {
  const lines: string[] = [];

  for (const title of titles) {
    const line = `• ${title}`;
    const next = [...lines, line].join('\n');

    if (next.length > limit) {
      break;
    }

    lines.push(line);
  }

  return lines.join('\n');
};
