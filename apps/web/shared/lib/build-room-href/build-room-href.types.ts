export type BuildRoomHrefOptions = {
  title?: string;
  view?: 'chat';
};

export type RoomSearch = BuildRoomHrefOptions & {
  id: string;
};
