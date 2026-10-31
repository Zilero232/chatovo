import type { BuildKeystorePropertiesInput } from './build-keystore-properties.types';

/** The `keystore.properties` that `signing.kts` reads; `storeFile` is relative to `app/`. */
export const buildKeystoreProperties = ({
  alias,
  password,
  storeFile
}: BuildKeystorePropertiesInput) =>
  [`keyAlias=${alias}`, `password=${password}`, `storeFile=${storeFile}`, ''].join('\n');
