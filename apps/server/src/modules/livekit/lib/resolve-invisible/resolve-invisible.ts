import type { ResolveInvisibleInput } from './resolve-invisible.types';

/**
 * Whether a token should join hidden. Only a role with the `invisible` permission
 * may be — the client's `invisible` flag is meaningless without the server-verified
 * role, so a plain user who forges it is still visible.
 */
export const resolveInvisible = ({ requested, canBeInvisible }: ResolveInvisibleInput): boolean =>
  Boolean(requested) && canBeInvisible;
