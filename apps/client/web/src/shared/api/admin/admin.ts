import type {
  AbuseReport,
  AdminReportQuery,
  AdminRoomList,
  AdminRoomQuery,
  AdminStats,
  AdminUser,
  AdminUserDetails,
  AdminUserList,
  AdminUserMessageList,
  AdminUserMessageQuery,
  AdminUserQuery,
  BlockUserValues,
  UpdateAdminUserValues
} from '@chatovo/schemas';

import { api } from '../http';

export const getAdminStats = async (): Promise<AdminStats> => {
  const { data } = await api.get<AdminStats>('/moderation/stats');

  return data;
};

export const listAdminUsers = async (query: AdminUserQuery): Promise<AdminUserList> => {
  const { data } = await api.get<AdminUserList>('/moderation/users', { params: query });

  return data;
};

export const updateAdminUser = async (
  userId: string,
  values: UpdateAdminUserValues
): Promise<AdminUser> => {
  const { data } = await api.patch<AdminUser>(`/moderation/users/${userId}`, values);

  return data;
};

export const blockAdminUser = async (
  userId: string,
  values: BlockUserValues
): Promise<AdminUser> => {
  const { data } = await api.post<AdminUser>(`/moderation/blocks/${userId}`, values);

  return data;
};

export const unblockAdminUser = async (userId: string): Promise<AdminUser> => {
  const { data } = await api.post<AdminUser>(`/moderation/blocks/${userId}/remove`);

  return data;
};

export const listAdminRooms = async (query: AdminRoomQuery): Promise<AdminRoomList> => {
  const { data } = await api.get<AdminRoomList>('/moderation/rooms', { params: query });

  return data;
};

export const deleteAdminRoom = async (roomId: string): Promise<void> => {
  await api.delete(`/moderation/rooms/${roomId}`);
};

export const listAdminReports = async (query: AdminReportQuery): Promise<AbuseReport[]> => {
  const { data } = await api.get<AbuseReport[]>('/moderation/reports', { params: query });

  return data;
};

export const resolveAdminReport = async (reportId: string): Promise<AbuseReport> => {
  const { data } = await api.post<AbuseReport>(`/moderation/reports/${reportId}/resolve`);

  return data;
};

export const getAdminUserDetails = async (userId: string): Promise<AdminUserDetails> => {
  const { data } = await api.get<AdminUserDetails>(`/moderation/users/${userId}/details`);

  return data;
};

export const listAdminUserMessages = async (
  userId: string,
  query: AdminUserMessageQuery
): Promise<AdminUserMessageList> => {
  const { data } = await api.get<AdminUserMessageList>(`/moderation/users/${userId}/messages`, {
    params: query
  });

  return data;
};
