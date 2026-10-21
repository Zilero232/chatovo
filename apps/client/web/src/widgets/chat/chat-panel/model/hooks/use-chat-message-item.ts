import { decodeChatAttachment } from '@chatovo/schemas';
import { useState } from 'react';

import { readParticipantMeta } from '@/entities/room/room';
import { useBlockedUserIds } from '@/entities/social/friend';

import type { ChatLine } from '../types';

import { findPreviewUrl, normalizeMessage } from '../lib';

type UseChatMessageItemArgs = {
  canManage: boolean;
  isGrouped: boolean;
  isOwn: boolean;
  message: ChatLine;
};

export const useChatMessageItem = ({
  message,
  isOwn,
  isGrouped,
  canManage
}: UseChatMessageItemArgs) => {
  const blockedIds = useBlockedUserIds();

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isReportingAbuse, setIsReportingAbuse] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const author = message.from?.name || message.from?.identity || 'Guest';
  const identity = message.from?.identity ?? author;

  const { verified, developer } = readParticipantMeta(message.from?.metadata);

  const isDeleted = Boolean(message.deletedAt);
  const attachment = !isDeleted ? decodeChatAttachment(message.message) : null;
  const previewUrl =
    isDeleted || attachment ? null : findPreviewUrl(normalizeMessage(message.message));

  const isUnsent = Boolean(message.status);
  const isEdited = Boolean(message.editedAt) && !isDeleted;
  const canEdit = canManage && isOwn && !isDeleted && !attachment && !isUnsent;
  const canReport = !isOwn && !isDeleted && !isUnsent;
  const isFromBlocked = !isOwn && blockedIds.has(identity);

  return {
    isEditing,
    setIsEditing,
    isConfirmingDelete,
    setIsConfirmingDelete,
    isReportingAbuse,
    setIsReportingAbuse,
    author,
    identity,
    verified,
    developer,
    isDeleted,
    attachment,
    previewUrl,
    isEdited,
    canEdit,
    canReport,
    isCollapsed: isFromBlocked && !isRevealed,
    showHeader: !isGrouped,
    showActions: canManage && !isDeleted && !isEditing && !isUnsent,
    startEdit: () => setIsEditing(true),
    reportAbuse: () => setIsReportingAbuse(true),
    reveal: () => setIsRevealed(true)
  };
};
