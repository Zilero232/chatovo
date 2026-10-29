import { Button } from '@chatovo/ui-kit';
import { PhoneCall, PhoneIncoming, PhoneMissed, PhoneOutgoing } from 'lucide-react';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { CallLogItemProps } from './CallLogItem.types';

import { useCallLogItem } from '../../../model/hooks';

import s from './CallLogItem.module.scss';

export const CallLogItem = ({ call, peerId, timestamp }: CallLogItemProps) => {
  const t = useTranslations('chat.callLog');

  const { label, duration, time, isOutgoing, isMissed, canCallBack, isCalling, callBack } =
    useCallLogItem({ call, peerId, timestamp });

  const icon = match({ isMissed, isOutgoing })
    .with({ isMissed: true }, () => <PhoneMissed />)
    .with({ isOutgoing: true }, () => <PhoneOutgoing />)
    .otherwise(() => <PhoneIncoming />);

  return (
    <div className={s.root} data-missed={isMissed || undefined}>
      <span aria-hidden className={s.icon}>
        {icon}
      </span>

      <span className={s.text}>
        <span className={s.label}>{label}</span>
        <span className={s.meta}>{duration === null ? time : `${duration} · ${time}`}</span>
      </span>

      {canCallBack && (
        <Button disabled={isCalling} size='xs' variant='ghost' onClick={callBack}>
          <PhoneCall aria-hidden />
          {t('callBack')}
        </Button>
      )}
    </div>
  );
};
