'use client';

import { Row } from '@chatovo/ui-kit';
import { useState } from 'react';

import { UserAvatar } from '@/entities/auth/user';

import type { UserRowProps } from './UserRow.types';

import { UserRowActions, UserRowDialogs, UserRowInfo } from './components';

import s from './UserRow.module.scss';

export const UserRow = ({ user }: UserRowProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);

  const name = user.displayName ?? user.name;

  return (
    <Row align='center' as='article' className={s.root} gap='3'>
      <UserAvatar colorize name={name} size='sm' src={user.avatarUrl} />

      <UserRowInfo user={user} />

      <UserRowActions
        user={user}
        onBlock={() => setIsBlockOpen(true)}
        onEdit={() => setIsEditOpen(true)}
        onShowDetails={() => setIsDetailsOpen(true)}
      />

      <UserRowDialogs
        isBlockOpen={isBlockOpen}
        isDetailsOpen={isDetailsOpen}
        isEditOpen={isEditOpen}
        user={user}
        onBlockOpenChange={setIsBlockOpen}
        onDetailsOpenChange={setIsDetailsOpen}
        onEditOpenChange={setIsEditOpen}
      />
    </Row>
  );
};
