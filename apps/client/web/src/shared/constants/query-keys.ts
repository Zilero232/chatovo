import type {
  AdminReportQuery,
  AdminRoomQuery,
  AdminUserMessageQuery,
  AdminUserQuery
} from '@chatovo/schemas';

const admin = {
  adminStats: () => ['admin-stats'] as const,
  adminUsers: (query: AdminUserQuery) => ['admin-users', query] as const,
  adminUserDetails: (userId: string) => ['admin-user-details', userId] as const,
  adminUserMessages: (userId: string, query: AdminUserMessageQuery) =>
    ['admin-user-messages', userId, query] as const,
  adminRooms: (query: AdminRoomQuery) => ['admin-rooms', query] as const,
  adminReports: (query: AdminReportQuery) => ['admin-reports', query] as const
};

const rooms = {
  room: (id: string | null) => ['room', id] as const,
  rooms: () => ['rooms'] as const,
  roomBans: (roomId: string) => ['room-bans', roomId] as const,
  livekitToken: (roomName: string | null, password?: string, invisible?: boolean) =>
    ['livekit-token', roomName, password ?? null, invisible ?? false] as const
};

const music = {
  roomMusicRoot: () => ['room-music'] as const,
  roomMusic: (roomId: string) => ['room-music', roomId] as const,
  radioStations: (query: string) => ['radio-stations', query] as const
};

const chat = {
  chatMessagesRoot: () => ['chat-messages'] as const,
  chatMessages: (roomId: string) => ['chat-messages', roomId] as const,
  linkPreview: (url: string) => ['link-preview', url] as const
};

const friends = {
  friends: () => ['friends'] as const,
  friendRequestsIncoming: () => ['friend-requests-incoming'] as const,
  dmCalls: () => ['dm-calls'] as const,
  friendsEpoch: () => ['friends-epoch'] as const,
  friendshipRelations: () => ['friendship-relation'] as const,
  friendshipRelation: (userId: string) => ['friendship-relation', userId] as const,
  friendDmRoom: (userId: string) => ['friend-dm-room', userId] as const,
  blockedUsers: () => ['blocked-users'] as const
};

const users = {
  userProfile: (id: string) => ['user-profile', id] as const
};

const meta = {
  dateLocale: (locale: string) => ['date-locale', locale] as const,
  developers: () => ['developers'] as const,
  release: () => ['release'] as const,
  runningGame: () => ['running-game'] as const
};

export const QUERY_KEYS = {
  ...admin,
  ...rooms,
  ...music,
  ...chat,
  ...friends,
  ...users,
  ...meta
};
