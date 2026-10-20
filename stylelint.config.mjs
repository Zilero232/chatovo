import { stylelint } from '@siberiacancode/stylelint';

export default {
  ...stylelint,
  ignoreFiles: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/out/**', '**/target/**'],
  rules: {
    ...stylelint.rules,

    // Prettier owns blank lines. Stylelint inserts one before a nested rule,
    // prettier strips it again, and the two never converge — lint:css and
    // format:check could not both pass until this yielded.
    'rule-empty-line-before': null,

    // CSS-Modules syntax the shared config does not know about.
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],

    // Names here are camelCase because they are read as `s.srOnly` from TSX;
    // the shared config asks for kebab-case.
    'keyframes-name-pattern': null,
    'scss/at-mixin-pattern': null,
    'selector-class-pattern': null
  },
  overrides: [
    {
      // These override cva size variants and Base UI's own inline styles, which
      // nothing weaker than !important can win against.
      files: [
        'apps/client/web/src/styles/globals.scss',
        'apps/client/web/src/features/auth/update-profile/ui/UpdateProfileForm.module.scss',
        'apps/client/web/src/widgets/room/voice-room/ui/components/RoomInviteButton/RoomInviteButton.module.scss',
        'apps/client/web/src/widgets/room/voice-room/ui/components/VoiceRoomChatButton/VoiceRoomChatButton.module.scss'
      ],
      rules: {
        'declaration-no-important': null
      }
    }
  ]
};
