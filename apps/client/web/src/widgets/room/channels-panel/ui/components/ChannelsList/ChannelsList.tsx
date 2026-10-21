import type { ReactNode } from 'react';

import { CenteredState, ScrollArea, SearchField, Skeleton } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useState } from 'react';
import { isEmpty as isEmptyList } from 'remeda';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { groupRooms, RoomsListError, useRooms, useRoomsPresence } from '@/entities/room/room';

import { ChannelsCreateCta } from '../ChannelsCreateCta/ChannelsCreateCta';
import { ChannelsRoomItem } from '../ChannelsRoomItem/ChannelsRoomItem';

import s from './ChannelsList.module.scss';

const CHANNELS_SKELETON_KEYS = ['a', 'b', 'c', 'd', 'e'] as const;

const SectionLabel = ({ children, offset = false }: { children: ReactNode; offset?: boolean }) => (
  <p className={clsx(s.sectionLabel, { [s.sectionLabelOffset]: offset })}>{children}</p>
);

const ChannelsListSkeleton = () => (
  <div className={s.skeletonList}>
    {CHANNELS_SKELETON_KEYS.map((key) => (
      <Skeleton key={key} className={s.skeletonItem} />
    ))}
  </div>
);

export const ChannelsList = () => {
  const t = useTranslations('channels');
  const tSections = useTranslations('room.sections');

  const { rooms, isLoading, isEmpty, isError } = useRooms();
  const presence = useRoomsPresence();

  const [query, setQuery] = useState('');

  const sections = groupRooms({ rooms, presence, query });

  return (
    <>
      <div className={s.search}>
        <SearchField placeholder={t('searchPlaceholder')} value={query} onValueChange={setQuery} />
        <ChannelsCreateCta />
      </div>

      <ScrollArea className={s.scroll}>
        <div className={s.list}>
          {match({ isLoading, isError, isEmpty, nothingFound: isEmptyList(sections) })
            .with({ isLoading: true }, () => <ChannelsListSkeleton />)
            .with({ isError: true }, () => (
              <div className={s.emptyState}>
                <RoomsListError />
              </div>
            ))
            .with({ isEmpty: true }, () => (
              <CenteredState
                className={s.emptyState}
                description={t('emptyHint')}
                size='sm'
                title={t('noRoomsYet')}
              />
            ))
            .with({ nothingFound: true }, () => (
              <CenteredState className={s.emptyState} size='sm' title={t('nothingFound')} />
            ))
            .otherwise(() =>
              sections.map((section, index) => (
                <div key={section.key}>
                  <SectionLabel offset={index > 0}>{tSections(section.key)}</SectionLabel>

                  {section.rooms.map((room, roomIndex) => (
                    <div
                      key={room.id}
                      className={s.itemAnim}
                      style={{ animationDelay: `${Math.min(roomIndex, 10) * 30}ms` }}
                    >
                      <ChannelsRoomItem room={room} />
                    </div>
                  ))}
                </div>
              ))
            )}
        </div>
      </ScrollArea>
    </>
  );
};
