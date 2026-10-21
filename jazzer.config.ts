import { defineConfig } from 'commit-jazzer';

export default defineConfig({
  language: 'ru',
  scopes: [
    'web',
    'native',
    'android',
    'landing',
    'server',
    'ui-kit',
    'schemas',
    'config',
    'infra',
    'ci',
    'e2e',
    'docs',
    'deps',
    'release'
  ],
  aliases: {
    deps: { type: 'upgrade', component: 'deps', title: 'update dependencies' }
  }
});
