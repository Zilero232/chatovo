import { Skeleton } from '@chatovo/ui-kit';
import { clsx } from 'clsx';

import s from './ChatLoadingSkeleton.module.scss';

const CHAT_SKELETON_ROWS = [
  { key: 'a', grouped: false, name: '5rem', lines: ['72%'] },
  { key: 'b', grouped: true, name: null, lines: ['48%'] },
  { key: 'c', grouped: false, name: '7rem', lines: ['90%', '55%'] },
  { key: 'd', grouped: false, name: '4.5rem', lines: ['38%'] },
  { key: 'e', grouped: true, name: null, lines: ['64%', '42%'] },
  { key: 'f', grouped: false, name: '6rem', lines: ['80%'] }
] as const;

export const ChatLoadingSkeleton = () => (
  <div className={s.list}>
    {CHAT_SKELETON_ROWS.map(({ key, grouped, name, lines }) => (
      <div key={key} className={clsx(s.row, { [s.rowGrouped]: grouped })}>
        {grouped ? (
          <span className={s.avatarSpacer} />
        ) : (
          <Skeleton className={s.avatar} shape='circle' />
        )}

        <div className={s.body}>
          {name && <Skeleton className={s.name} shape='title' width={name} />}

          {lines.map((width) => (
            <Skeleton key={width} shape='text' width={width} />
          ))}
        </div>
      </div>
    ))}
  </div>
);
