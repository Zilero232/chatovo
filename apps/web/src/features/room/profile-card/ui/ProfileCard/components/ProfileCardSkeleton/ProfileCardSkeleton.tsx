import { Skeleton } from '@chatovo/ui-kit';

import s from './ProfileCardSkeleton.module.scss';

export const ProfileCardSkeleton = () => (
  <div className={s.root}>
    <Skeleton className={s.banner} />

    <div className={s.body}>
      <Skeleton className={s.avatar} shape='circle' />

      <div className={s.identity}>
        <Skeleton shape='title' width='8rem' />
        <Skeleton className={s.tag} shape='text' width='5rem' />
      </div>

      <div className={s.bio}>
        <Skeleton shape='text' width='100%' />
        <Skeleton shape='text' width='62%' />
      </div>

      <Skeleton className={s.voiceBlock} />

      <div className={s.actions}>
        <Skeleton className={s.action} />
        <Skeleton className={s.action} />
      </div>
    </div>
  </div>
);
