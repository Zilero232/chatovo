'use client';

import type { UserRowDialogsProps } from './UserRowDialogs.types';

import { BlockUserDialog } from '../../../BlockUserDialog/BlockUserDialog';
import { EditUserDialog } from '../../../EditUserDialog/EditUserDialog';
import { UserDetailsDialog } from '../../../UserDetailsDialog/UserDetailsDialog';

export const UserRowDialogs = ({
  isBlockOpen,
  isDetailsOpen,
  isEditOpen,
  user,
  onBlockOpenChange,
  onDetailsOpenChange,
  onEditOpenChange
}: UserRowDialogsProps) => (
  <>
    <UserDetailsDialog open={isDetailsOpen} user={user} onOpenChange={onDetailsOpenChange} />
    <EditUserDialog open={isEditOpen} user={user} onOpenChange={onEditOpenChange} />
    <BlockUserDialog open={isBlockOpen} user={user} onOpenChange={onBlockOpenChange} />
  </>
);
