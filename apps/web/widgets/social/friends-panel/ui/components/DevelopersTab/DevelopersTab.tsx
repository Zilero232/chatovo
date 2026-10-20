'use client';

import type { UserProfile } from '@chatovo/schemas';

import { CenteredState, Spinner } from '@chatovo/ui-kit';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';
import { match, P } from 'ts-pattern';

import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';

import { useDevelopersList } from '../../../model/hooks';
import { DeveloperListItem } from './DeveloperListItem/DeveloperListItem';

import s from '../../FriendsPanel.module.scss';

const hasDevelopers = (developers: UserProfile[] | undefined): developers is UserProfile[] =>
  !isEmpty(developers ?? []);

export const DevelopersTab = () => {
  const t = useTranslations('friends');

  const { developers, isPending, isFriend } = useDevelopersList();

  return match({ isPending, developers })
    .with({ isPending: true }, () => <Spinner className={s.spinner} />)
    .with({ developers: P.when(hasDevelopers) }, ({ developers: items }) => (
      <div className={s.list}>
        <AnimatePresence initial={false} mode='popLayout'>
          {items.map((developer) => (
            <motion.div
              key={developer.id}
              animate={LIST_ITEM_ANIMATE}
              exit={LIST_ITEM_EXIT}
              initial={LIST_ITEM_INITIAL}
              layout='position'
              transition={LIST_ITEM_TRANSITION}
            >
              <DeveloperListItem developer={developer} isFriend={isFriend(developer.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    ))
    .otherwise(() => (
      <CenteredState
        className={s.empty}
        description={t('emptyDevelopersHint')}
        pattern='dots'
        size='sm'
        title={t('emptyDevelopersTitle')}
      />
    ));
};
