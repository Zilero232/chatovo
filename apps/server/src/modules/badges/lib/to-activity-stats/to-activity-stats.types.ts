export type MessageActivityRow = {
  dmChats: bigint | number | null;
  groupRooms: bigint | number | null;
  attachments: bigint | number | null;
  activeDays: bigint | number | null;
};

export type CallActivityRow = {
  seconds: bigint | number | null;
};

export type ToActivityStatsInput = {
  messages: MessageActivityRow | undefined;
  calls: CallActivityRow | undefined;
};

export type ActivityStats = {
  talker: number;
  penPal: number;
  wanderer: number;
  sharer: number;
  regular: number;
};
