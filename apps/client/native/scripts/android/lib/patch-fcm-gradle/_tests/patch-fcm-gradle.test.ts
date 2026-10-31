import { describe, expect, it } from 'vitest';

import { addGoogleServicesClasspath, applyGoogleServicesPlugin } from '../patch-fcm-gradle';

const ROOT_GRADLE = `buildscript {
    repositories {
        google()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.11.0")
    }
}
`;

const APP_GRADLE = `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("rust")
}
`;

describe('addGoogleServicesClasspath', () => {
  it('adds the classpath as the first buildscript dependency', () => {
    const patched = addGoogleServicesClasspath(ROOT_GRADLE);

    expect(patched).toContain(
      'dependencies {\n        classpath("com.google.gms:google-services:4.4.2")\n        classpath("com.android.tools.build'
    );
  });

  it('is idempotent', () => {
    const once = addGoogleServicesClasspath(ROOT_GRADLE);

    expect(addGoogleServicesClasspath(once)).toBe(once);
  });

  it('throws when the buildscript block is missing', () => {
    expect(() => addGoogleServicesClasspath('plugins {}\n')).toThrow('buildscript');
  });
});

describe('applyGoogleServicesPlugin', () => {
  it('applies the plugin right after the rust plugin', () => {
    const patched = applyGoogleServicesPlugin(APP_GRADLE);

    expect(patched).toContain('id("rust")\n    id("com.google.gms.google-services")\n}');
  });

  it('is idempotent', () => {
    const once = applyGoogleServicesPlugin(APP_GRADLE);

    expect(applyGoogleServicesPlugin(once)).toBe(once);
  });

  it('throws when the rust plugin is missing', () => {
    expect(() => applyGoogleServicesPlugin('plugins {\n    id("x")\n}\n')).toThrow('plugins');
  });
});
