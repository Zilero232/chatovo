import { Skeleton, Spinner } from '@chatovo/ui-kit';

import type { RoomSkeletonProps } from './RoomSkeleton.types';

import { ROOM_SKELETON_CONTROLS, ROOM_SKELETON_TILES } from '../../../config';

import s from './RoomSkeleton.module.scss';

export const RoomSkeleton = ({ children }: RoomSkeletonProps) => (
  <div aria-busy className={s.root}>
    <div className={s.header}>
      <Skeleton className={s.headerIcon} shape='circle' />
      <Skeleton shape='title' width='10rem' />
      <Skeleton className={s.headerAction} />
    </div>

    <div className={s.stage}>
      {ROOM_SKELETON_TILES.map((tile) => (
        <div key={tile} className={s.tile}>
          <Skeleton className={s.avatar} shape='circle' />
          <Skeleton shape='text' width='5rem' />
        </div>
      ))}
    </div>

    <div className={s.footer}>
      <span className={s.status} role='status'>
        <Spinner size='sm' />
        {children}
      </span>

      <div className={s.controls}>
        {ROOM_SKELETON_CONTROLS.map((control) => (
          <Skeleton key={control} className={s.control} shape='circle' />
        ))}
      </div>
    </div>
  </div>
);
