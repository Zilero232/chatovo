import { canActOnRole, decodeChatAttachment, resolveCosmetic } from '@chatovo/schemas';
import { useState } from 'react';

import { useCurrentUser } from '@/entities/auth/user';
import { readParticipantMeta } from '@/entities/room/room';
import { useBlockedUserIds } from '@/entities/social/friend';

import type { ChatLine } from '../types';

import { findPreviewUrl, normalizeMessage } from '../lib';

type UseChatMessageItemArgs = {
  canManage: boolean;
  isGrouped: boolean;
  isOwn: boolean;
  isReadOnly: boolean;
  message: ChatLine;
};

export const useChatMessageItem = ({
  message,
  isOwn,
  isGrouped,
  isReadOnly,
  canManage
}: UseChatMessageItemArgs) => {
  const { role } = useCurrentUser();
  const blockedIds = useBlockedUserIds();

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isReportingAbuse, setIsReportingAbuse] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const author = message.from?.name || message.from?.identity || 'Guest';
  const identity = message.from?.identity ?? author;

  const { verified, developer, cosmetics } = readParticipantMeta(message.from?.metadata);
  const nameStyle = resolveCosmetic({ key: cosmetics.nameStyle, kind: 'nameStyle' });

  const isDeleted = Boolean(message.deletedAt);
  const attachment = !isDeleted ? decodeChatAttachment(message.message) : null;
  const previewUrl =
    isDeleted || attachment ? null : findPreviewUrl(normalizeMessage(message.message));

  const isUnsent = Boolean(message.status);
  const canDelete =
    canManage && (isOwn || canActOnRole({ actorRole: role, targetRole: message.from?.role }));
  const isEdited = Boolean(message.editedAt) && !isDeleted;
  const canEdit = canManage && isOwn && !isReadOnly && !isDeleted && !attachment && !isUnsent;
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
    nameStyle,
    isDeleted,
    attachment,
    previewUrl,
    isEdited,
    canEdit,
    canReport,
    isCollapsed: isFromBlocked && !isRevealed,
    showHeader: !isGrouped,
    showActions: canDelete && !isDeleted && !isEditing && !isUnsent,
    startEdit: () => setIsEditing(true),
    reportAbuse: () => setIsReportingAbuse(true),
    reveal: () => setIsRevealed(true)
  };
};
