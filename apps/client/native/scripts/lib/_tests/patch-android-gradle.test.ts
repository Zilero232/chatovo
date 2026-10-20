import { describe, expect, it } from 'vitest';

// @ts-expect-error -- plain .mjs build script, no type declarations
import { patchAndroidGradle } from '../patch-android-gradle.mjs';

const SIGNING_SNIPPET = `    signingConfigs {
        create("release") {
            enableV1Signing = true
            val props = Properties()
            keyAlias = props["keyAlias"] as String
        }
    }
`;

const GENERATED = `import java.util.Properties
import java.io.FileInputStream

plugins {
    id("com.android.application")
}

android {
    compileSdk = 36
    namespace = "chatovo.app"
    defaultConfig {
        applicationId = "chatovo.app"
        minSdk = 24
        targetSdk = 36
        versionCode = tauriProperties.getProperty("tauri.android.versionCode", "1").toInt()
        versionName = tauriProperties.getProperty("tauri.android.versionName", "1.0")
    }
    buildTypes {
        getByName("debug") {
            isDebuggable = true
        }
        getByName("release") {
            isMinifyEnabled = true
        }
    }
}
`;

const patch = (gradle: string): string =>
  patchAndroidGradle({ gradle, signingSnippet: SIGNING_SNIPPET });

const countOf = ({ haystack, needle }: { haystack: string; needle: string }): number =>
  haystack.split(needle).length - 1;

describe('patchAndroidGradle', () => {
  it('adds the signing config and points the release build type at it', () => {
    const patched = patch(GENERATED);

    expect(patched).toContain('signingConfigs {');
    expect(patched).toContain('signingConfig = signingConfigs.getByName("release")');
  });

  it('places the ndk block inside defaultConfig, not at the android top level', () => {
    const patched = patch(GENERATED);

    const defaultConfig = patched.slice(
      patched.indexOf('defaultConfig {'),
      patched.indexOf('    buildTypes {')
    );

    expect(defaultConfig).toContain('debugSymbolLevel = "FULL"');
  });

  it('indents the ndk block for defaultConfig', () => {
    const patched = patch(GENERATED);

    expect(patched).toContain('        ndk {\n            debugSymbolLevel = "FULL"\n        }');
  });

  it('keeps the versionName line it anchors on', () => {
    const patched = patch(GENERATED);

    expect(patched).toContain(
      'versionName = tauriProperties.getProperty("tauri.android.versionName", "1.0")'
    );
  });

  it('is idempotent', () => {
    const once = patch(GENERATED);
    const twice = patch(once);

    expect(twice).toBe(once);
    expect(countOf({ haystack: twice, needle: 'debugSymbolLevel' })).toBe(1);
    expect(countOf({ haystack: twice, needle: 'signingConfigs {' })).toBe(1);
  });

  it('replaces an existing signingConfigs block instead of adding a second one', () => {
    const patched = patch(patch(GENERATED));

    expect(countOf({ haystack: patched, needle: 'signingConfigs {' })).toBe(1);
  });

  it('adds the FileInputStream import when the generated file lacks it', () => {
    const withoutImport = GENERATED.replace('import java.io.FileInputStream\n', '');

    expect(patch(withoutImport)).toContain('import java.io.FileInputStream');
  });

  it('does not duplicate the FileInputStream import', () => {
    const patched = patch(GENERATED);

    expect(countOf({ haystack: patched, needle: 'import java.io.FileInputStream' })).toBe(1);
  });

  it('throws when defaultConfig no longer carries a versionName to anchor on', () => {
    const renamed = GENERATED.replace(/^ {8}versionName = .*$/m, '        versionNameSuffix = ""');

    expect(() => patch(renamed)).toThrow('versionName not found');
  });
});
