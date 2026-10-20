import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import rootPackage from '../../../package.json' with { type: 'json' };
import en from '../shared/i18n/locales/en/marketing.json' with { type: 'json' };
import ru from '../shared/i18n/locales/ru/marketing.json' with { type: 'json' };
import { CHANGELOG_RELEASES } from '../views/changelog/config';
import { formatStoreReleaseNotes } from '../views/changelog/lib';

const PLAY_RELEASE_NOTES_LIMIT = 500;

const LOCALES = [
  { file: 'whatsnew-ru-RU', messages: ru },
  { file: 'whatsnew-en-US', messages: en }
];

const outDir = process.argv[2];

if (!outDir) {
  throw new Error('Usage: bun scripts/write-play-release-notes.ts <out-dir>');
}

const { version } = rootPackage;
const release = CHANGELOG_RELEASES.find((entry) => entry.version === version);

if (!release) {
  throw new Error(
    `No changelog entry for ${version}: add it to views/changelog/config/releases.ts`
  );
}

mkdirSync(outDir, { recursive: true });

for (const { file, messages } of LOCALES) {
  const titles = release.entries.map(({ key }) => messages.changelog.entries[key].title);
  const notes = formatStoreReleaseNotes({ titles, limit: PLAY_RELEASE_NOTES_LIMIT });

  writeFileSync(path.join(outDir, file), notes);
}

console.info(`[play] release notes for ${version} written to ${outDir}`);
