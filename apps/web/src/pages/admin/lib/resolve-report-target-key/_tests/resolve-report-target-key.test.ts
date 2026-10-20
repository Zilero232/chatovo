import { describe, expect, it } from 'vitest';

import { resolveReportTargetKey } from '../resolve-report-target-key';

describe('resolveReportTargetKey', () => {
  it('maps a user report to its own key', () => {
    expect(resolveReportTargetKey('user')).toBe('reports.targetUser');
  });

  it('maps a message report to its own key', () => {
    expect(resolveReportTargetKey('message')).toBe('reports.targetMessage');
  });

  it('maps a room report to its own key', () => {
    expect(resolveReportTargetKey('room')).toBe('reports.targetRoom');
  });

  it('returns a full namespaced key, not a bare suffix', () => {
    expect(resolveReportTargetKey('user').startsWith('reports.')).toBe(true);
  });
});
