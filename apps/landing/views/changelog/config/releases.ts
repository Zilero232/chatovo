import type { Messages } from '@/shared/i18n';

export type ChangelogEntryKind = keyof Messages['changelog']['kinds'];

export type ChangelogTone = keyof Messages['changelog']['tones'];

export type ChangelogEntryKey = keyof Messages['changelog']['entries'];

export type ChangelogHighlightKey = keyof Messages['changelog']['highlights'];

export type ChangelogEntry = {
  key: ChangelogEntryKey;
  kind: ChangelogEntryKind;
};

export type ChangelogRelease = {
  date: string;
  entries: ChangelogEntry[];
  highlights: ChangelogHighlightKey[];
  tone: ChangelogTone;
  version: string;
};

export const CHANGELOG_RELEASES: ChangelogRelease[] = [
  {
    version: '1.10.1',
    date: '2026-10-21',
    tone: 'minor',
    highlights: ['chatBesideRoom', 'tidierMenu'],
    entries: [
      { kind: 'improvement', key: 'chatBesideRoom' },
      { kind: 'improvement', key: 'tidierMenu' },
      { kind: 'improvement', key: 'inviteTile' },
      { kind: 'improvement', key: 'languageSelect' },
      { kind: 'fix', key: 'fullScreenSettings' }
    ]
  },
  {
    version: '1.10.0',
    date: '2026-10-21',
    tone: 'major',
    highlights: ['nineLanguages', 'roomModeration'],
    entries: [
      { kind: 'feature', key: 'nineLanguages' },
      { kind: 'feature', key: 'roomModeration' },
      { kind: 'feature', key: 'blockUsers' },
      { kind: 'feature', key: 'chatFilter' },
      { kind: 'feature', key: 'backgroundCalls' },
      { kind: 'improvement', key: 'calmerIcon' },
      { kind: 'improvement', key: 'phoneLayout' },
      { kind: 'improvement', key: 'stopMusic' },
      { kind: 'fix', key: 'honestMute' },
      { kind: 'fix', key: 'voiceSettingsMidCall' }
    ]
  },
  {
    version: '1.9.0',
    date: '2026-10-21',
    tone: 'major',
    highlights: ['newSite', 'fasterApp'],
    entries: [
      { kind: 'feature', key: 'newSite' },
      { kind: 'improvement', key: 'fasterApp' },
      { kind: 'improvement', key: 'newIcon' },
      { kind: 'improvement', key: 'chatFullHeight' },
      { kind: 'fix', key: 'cyrillicRoomNames' },
      { kind: 'fix', key: 'speakingCorners' }
    ]
  },
  {
    version: '1.8.0',
    date: '2026-10-20',
    tone: 'major',
    highlights: ['roomMusic', 'newLook'],
    entries: [
      { kind: 'feature', key: 'roomMusic' },
      { kind: 'feature', key: 'shareMyMusic' },
      { kind: 'feature', key: 'musicPlayer' },
      { kind: 'improvement', key: 'musicDucking' },
      { kind: 'improvement', key: 'newLook' },
      { kind: 'fix', key: 'screenShareEcho' },
      { kind: 'fix', key: 'speakingHighlight' },
      { kind: 'fix', key: 'android16kb' }
    ]
  },
  {
    version: '1.7.0',
    date: '2026-10-12',
    tone: 'major',
    highlights: ['pushReliable', 'smoothMobileMenu'],
    entries: [
      { kind: 'feature', key: 'pushReliable' },
      { kind: 'feature', key: 'pushOpensChat' },
      { kind: 'improvement', key: 'smoothMobileMenu' },
      { kind: 'improvement', key: 'androidDownload' },
      { kind: 'improvement', key: 'appIcon' },
      { kind: 'fix', key: 'roomNamesClipped' },
      { kind: 'fix', key: 'roomChatOpaque' }
    ]
  },
  {
    version: '1.6.1',
    date: '2026-10-10',
    tone: 'minor',
    highlights: ['passwordRoomLogout', 'oldImagesOptimized'],
    entries: [
      { kind: 'fix', key: 'passwordRoomLogout' },
      { kind: 'fix', key: 'oldImagesOptimized' },
      { kind: 'fix', key: 'renameKeepsAccess' },
      { kind: 'fix', key: 'downloadButton' },
      { kind: 'improvement', key: 'fasterLinkPreviews' }
    ]
  },
  {
    version: '1.6.0',
    date: '2026-10-10',
    tone: 'major',
    highlights: ['linkPreviews', 'fastImages'],
    entries: [
      { kind: 'feature', key: 'linkPreviews' },
      { kind: 'improvement', key: 'fastImages' },
      { kind: 'fix', key: 'liveRoomList' },
      { kind: 'fix', key: 'privateRoomOwner' },
      { kind: 'improvement', key: 'gamesOnly' },
      { kind: 'fix', key: 'desktopLockdown' }
    ]
  },
  {
    version: '1.5.0',
    date: '2026-09-11',
    tone: 'major',
    highlights: ['googlePlay', 'accountDeletion'],
    entries: [
      { kind: 'feature', key: 'googlePlay' },
      { kind: 'feature', key: 'accountDeletion' }
    ]
  },
  {
    version: '1.4.2',
    date: '2026-09-10',
    tone: 'minor',
    highlights: ['participantVolume', 'sessionExpiry', 'adminEditStability'],
    entries: [
      { kind: 'feature', key: 'screenAudioVolume' },
      { kind: 'fix', key: 'participantVolume' },
      { kind: 'fix', key: 'pingIndicator' },
      { kind: 'fix', key: 'leaveRoom' },
      { kind: 'fix', key: 'sessionExpiry' },
      { kind: 'fix', key: 'adminEditStability' },
      { kind: 'improvement', key: 'chatReadability' }
    ]
  },
  {
    version: '1.4.1',
    date: '2026-09-07',
    tone: 'minor',
    highlights: ['appHost', 'roomPasswordScreen'],
    entries: [
      { kind: 'feature', key: 'appHost' },
      { kind: 'feature', key: 'lobbyButton' },
      { kind: 'improvement', key: 'roomPasswordScreen' },
      { kind: 'fix', key: 'spinAnimations' },
      { kind: 'fix', key: 'blurryIcons' },
      { kind: 'fix', key: 'trayUpdateSpinner' }
    ]
  },
  {
    version: '1.4.0',
    date: '2026-09-06',
    tone: 'major',
    highlights: ['persistentRoom', 'privateRooms', 'siteRebuild'],
    entries: [
      { kind: 'feature', key: 'persistentRoom' },
      { kind: 'feature', key: 'gameActivity' },
      { kind: 'feature', key: 'soundboard' },
      { kind: 'feature', key: 'sitePages' },
      { kind: 'fix', key: 'privateRoomPassword' },
      { kind: 'fix', key: 'adminBadges' },
      { kind: 'improvement', key: 'seoPass' }
    ]
  },
  {
    version: '1.3.9',
    date: '2026-09-04',
    tone: 'minor',
    highlights: ['invisibleHardening'],
    entries: [
      { kind: 'feature', key: 'invisibleAdminMenu' },
      { kind: 'feature', key: 'invisibleMutual' },
      { kind: 'security', key: 'roomPasswordHashing' },
      { kind: 'security', key: 'demoteRevoke' },
      { kind: 'fix', key: 'autoSensitivitySpeaker' },
      { kind: 'fix', key: 'adminValidation' },
      { kind: 'fix', key: 'a11yConnection' }
    ]
  },
  {
    version: '1.3.7',
    date: '2026-09-03',
    tone: 'major',
    highlights: ['rustore', 'adminPanel'],
    entries: [
      { kind: 'feature', key: 'rustoreRelease' },
      { kind: 'feature', key: 'adminPanel' },
      { kind: 'feature', key: 'moderation' }
    ]
  },
  {
    version: '1.3.6',
    date: '2026-09-02',
    tone: 'minor',
    highlights: ['invisibleMode'],
    entries: [{ kind: 'feature', key: 'invisibleMode' }]
  },
  {
    version: '1.3.4',
    date: '2026-09-01',
    tone: 'minor',
    highlights: ['tests', 'migrations'],
    entries: [
      { kind: 'feature', key: 'prismaMigrations' },
      { kind: 'feature', key: 'contributors' },
      { kind: 'improvement', key: 'testSetup' },
      { kind: 'improvement', key: 'nativeTray' },
      { kind: 'fix', key: 'realErrorCodes' }
    ]
  },
  {
    version: '1.3.3',
    date: '2026-08-14',
    tone: 'minor',
    highlights: ['easterEggs'],
    entries: [
      { kind: 'feature', key: 'easterEggs' },
      { kind: 'improvement', key: 'uiKitLayer' }
    ]
  },
  {
    version: '1.3.1',
    date: '2026-08-13',
    tone: 'minor',
    highlights: ['developerBadge'],
    entries: [
      { kind: 'feature', key: 'developerBadge' },
      { kind: 'feature', key: 'mobileUpdateBanner' },
      { kind: 'improvement', key: 'a11yPass' }
    ]
  },
  {
    version: '1.3.0',
    date: '2026-08-12',
    tone: 'minor',
    highlights: ['activitySidebar'],
    entries: [{ kind: 'feature', key: 'activitySidebar' }]
  },
  {
    version: '1.2.4',
    date: '2026-07-16',
    tone: 'minor',
    highlights: ['localizedErrors'],
    entries: [
      { kind: 'feature', key: 'localizedErrors' },
      { kind: 'fix', key: 'pushDelivery' }
    ]
  },
  {
    version: '1.2.3',
    date: '2026-07-16',
    tone: 'major',
    highlights: ['landing', 'nestjs'],
    entries: [
      { kind: 'feature', key: 'publicLanding' },
      { kind: 'improvement', key: 'nestjsMigration' },
      { kind: 'improvement', key: 'scssModules' }
    ]
  },
  {
    version: '1.2.1',
    date: '2026-07-03',
    tone: 'minor',
    highlights: ['pushNotifications'],
    entries: [{ kind: 'feature', key: 'fcmPush' }]
  },
  {
    version: '1.1.8',
    date: '2026-07-03',
    tone: 'major',
    highlights: ['friends'],
    entries: [
      { kind: 'feature', key: 'friendsAndCalls' },
      { kind: 'feature', key: 'dmNotifications' },
      { kind: 'improvement', key: 'websocketRealtime' }
    ]
  },
  {
    version: '1.1.3',
    date: '2026-07-02',
    tone: 'major',
    highlights: ['android'],
    entries: [
      { kind: 'feature', key: 'androidApp' },
      { kind: 'improvement', key: 'seoBrand' }
    ]
  },
  {
    version: '1.0.9',
    date: '2026-06-08',
    tone: 'minor',
    highlights: ['telegramNotifications'],
    entries: [
      { kind: 'feature', key: 'telegramNotifications' },
      { kind: 'feature', key: 'webPttNotice' },
      { kind: 'fix', key: 'chatRealtimeSync' }
    ]
  },
  {
    version: '1.0.8',
    date: '2026-06-07',
    tone: 'minor',
    highlights: ['chatEditDelete'],
    entries: [{ kind: 'feature', key: 'chatEditDelete' }]
  },
  {
    version: '1.0.6',
    date: '2026-06-07',
    tone: 'minor',
    highlights: ['foxMascot'],
    entries: [{ kind: 'feature', key: 'foxMascot' }]
  },
  {
    version: '1.0.5',
    date: '2026-06-07',
    tone: 'minor',
    highlights: ['videoQuality'],
    entries: [{ kind: 'feature', key: 'videoQuality' }]
  },
  {
    version: '1.0.4',
    date: '2026-06-07',
    tone: 'minor',
    highlights: ['voiceGate'],
    entries: [
      { kind: 'feature', key: 'voiceGate' },
      { kind: 'feature', key: 'bugReports' }
    ]
  },
  {
    version: '1.0.3',
    date: '2026-06-04',
    tone: 'minor',
    highlights: ['passwordReset'],
    entries: [
      { kind: 'feature', key: 'passwordReset' },
      { kind: 'feature', key: 'securityTab' },
      { kind: 'improvement', key: 'smtpEmail' }
    ]
  },
  {
    version: '1.0.0',
    date: '2026-06-01',
    tone: 'major',
    highlights: ['selfHosted'],
    entries: [
      { kind: 'feature', key: 'betterAuth' },
      { kind: 'improvement', key: 'selfHostedPostgres' }
    ]
  },
  {
    version: '0.3.1',
    date: '2026-05-31',
    tone: 'minor',
    highlights: ['chatPersistence'],
    entries: [
      { kind: 'feature', key: 'chatPersistence' },
      { kind: 'feature', key: 'fileAttachments' },
      { kind: 'feature', key: 'chatMarkdown' }
    ]
  },
  {
    version: '0.2.8',
    date: '2026-05-29',
    tone: 'minor',
    highlights: ['roomControls'],
    entries: [
      { kind: 'feature', key: 'roomControlBar' },
      { kind: 'feature', key: 'profileCard' },
      { kind: 'feature', key: 'reactions' }
    ]
  },
  {
    version: '0.2.6',
    date: '2026-05-29',
    tone: 'minor',
    highlights: ['glassRedesign'],
    entries: [
      { kind: 'feature', key: 'lobbyHero' },
      { kind: 'improvement', key: 'glassRedesign' }
    ]
  },
  {
    version: '0.2.2',
    date: '2026-05-27',
    tone: 'minor',
    highlights: ['shortcuts'],
    entries: [
      { kind: 'feature', key: 'globalShortcuts' },
      { kind: 'feature', key: 'pushToTalk' },
      { kind: 'feature', key: 'systemTray' }
    ]
  },
  {
    version: '0.2.0',
    date: '2026-05-23',
    tone: 'minor',
    highlights: ['autoUpdate'],
    entries: [
      { kind: 'feature', key: 'autoUpdate' },
      { kind: 'feature', key: 'i18n' }
    ]
  },
  {
    version: '0.1.4',
    date: '2026-05-21',
    tone: 'minor',
    highlights: ['selfHostedSfu'],
    entries: [
      { kind: 'feature', key: 'selfHostedLivekit' },
      { kind: 'feature', key: 'connectionQuality' }
    ]
  },
  {
    version: '0.1.0',
    date: '2026-05-20',
    tone: 'major',
    highlights: ['firstRelease'],
    entries: [
      { kind: 'feature', key: 'voiceRooms' },
      { kind: 'feature', key: 'desktopApp' },
      { kind: 'feature', key: 'chatPanel' }
    ]
  }
];
