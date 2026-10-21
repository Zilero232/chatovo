import { BUILT_IN_COMMIT_TYPE_NAMES } from 'commit-jazzer';

/**
 * Conventional Commits, enforced on commit-msg via husky. Messages are written
 * with commit-jazzer (`bun run commit`, or the prepare-commit-msg hook).
 *
 * Deviations from @commitlint/config-conventional:
 *   - type-enum is commit-jazzer's built-in list, a superset of the
 *     conventional types (upgrade, security, …).
 *   - subject-case is off: the subject starts with the type's emoji.
 *   - header-max-length 120 (default 100) — existing history has subjects up
 *     to 108 chars; a stricter limit would reject the established style.
 *   - scope stays free-form: jazzer.config.ts suggests the apps and packages,
 *     but domains (auth, room, chat, music) are welcome too.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', BUILT_IN_COMMIT_TYPE_NAMES],
    'header-max-length': [2, 'always', 120],
    'body-max-line-length': [0],
    'subject-case': [0]
  }
};
