'use client';

import { FriendsTabs } from './components';

import s from './FriendsPanel.module.scss';

export const FriendsPanel = () => (
  <section className={s.root}>
    <FriendsTabs />
  </section>
);
