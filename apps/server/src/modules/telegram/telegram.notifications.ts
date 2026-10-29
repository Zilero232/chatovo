import { bold, code, fmt, link } from '@grammyjs/parse-mode';

import type {
  AbuseReportNotification,
  ProblemReportNotification,
  RoomCreatedNotification,
  RoomDeletedNotification,
  UserBlockedNotification,
  UserSignupNotification
} from './telegram.types';

import { send } from './bot';
import { roomUrl } from './links';

const formatCount = (value: number): string => value.toLocaleString('ru-RU');

export const notifyUserSignup = ({
  name,
  email,
  totalUsers,
  signupsLastDay
}: UserSignupNotification): Promise<void> =>
  send(
    fmt`✨ Новый пользователь: ${bold()}${name}${bold()} (${email})\nВсего пользователей: ${formatCount(totalUsers)} · за сутки: ${formatCount(signupsLastDay)}`
  );

export const notifyRoomCreated = ({
  roomId,
  roomName,
  ownerName,
  isPrivate,
  totalRooms
}: RoomCreatedNotification): Promise<void> => {
  const badge = isPrivate ? '🔒 приватная' : '🌐 публичная';
  const name = fmt`${bold()}${roomName}${bold()}`;
  const title =
    roomId === null ? name : fmt`${link(roomUrl(roomId))}${name}${link(roomUrl(roomId))}`;

  return send(
    fmt`➕ Новая комната ${title} (${badge})\nВладелец: ${ownerName}\nВсего комнат: ${formatCount(totalRooms)}`
  );
};

export const notifyRoomDeleted = ({
  roomName,
  ownerName
}: RoomDeletedNotification): Promise<void> =>
  send(fmt`➖ Комната ${bold()}${roomName}${bold()} удалена\nВладелец: ${ownerName}`);

export const notifyProblemReport = ({
  reporter,
  email,
  description,
  platform,
  appVersion
}: ProblemReportNotification): Promise<void> => {
  const trimmed = description.length > 500 ? `${description.slice(0, 500)}…` : description;
  const meta = [platform, appVersion].filter(Boolean).join(' · ');

  return send(
    fmt`🐞 Жалоба от ${bold()}${reporter}${bold()} (${email})${meta ? fmt` — ${meta}` : ''}\n\n${trimmed}`
  );
};

export const notifyAbuseReport = ({
  reporter,
  target,
  targetId,
  reason,
  comment,
  roomName
}: AbuseReportNotification): Promise<void> => {
  const trimmed = comment && comment.length > 500 ? `${comment.slice(0, 500)}…` : comment;
  const where = roomName ? fmt` в комнате ${bold()}${roomName}${bold()}` : '';

  return send(
    fmt`🚨 Жалоба на ${bold()}${target}${bold()} (${code()}${targetId}${code()})${where}\nПричина: ${bold()}${reason}${bold()}\nОт: ${reporter}${trimmed ? fmt`\n\n${trimmed}` : ''}`
  );
};

export const notifyUserBlocked = ({
  userId,
  userName,
  email,
  reason,
  reportCount,
  blockedBy
}: UserBlockedNotification): Promise<void> =>
  send(
    fmt`⛔ Блокировка: ${bold()}${userName}${bold()} (${email})\nID: ${code()}${userId}${code()}\nПричина: ${reason}\nЖалоб на пользователя: ${formatCount(reportCount)}\nМодератор: ${code()}${blockedBy}${code()}`
  );
