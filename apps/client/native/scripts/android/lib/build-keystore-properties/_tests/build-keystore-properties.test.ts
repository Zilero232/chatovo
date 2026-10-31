import { describe, expect, it } from 'vitest';

import { buildKeystoreProperties } from '../build-keystore-properties';

describe('buildKeystoreProperties', () => {
  it('writes the alias, password and store file, one per line', () => {
    const properties = buildKeystoreProperties({
      alias: 'chatovo',
      password: 'secret',
      storeFile: '../chatovo.keystore'
    });

    expect(properties).toBe('keyAlias=chatovo\npassword=secret\nstoreFile=../chatovo.keystore\n');
  });
});
