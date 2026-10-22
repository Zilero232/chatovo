import type { SendFriendRequestInput } from '@chatovo/schemas';

import { sendFriendRequestInputSchema } from '@chatovo/schemas';
import { Button, Spinner } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useCurrentUser } from '@/entities/auth/user';
import { FriendTag, useSendFriendRequest } from '@/entities/social/friend';

import s from '../../FriendsPanel.module.scss';

export const AddFriendTab = () => {
  const t = useTranslations('friends');
  const toastError = useToastError();

  const { friendTag } = useCurrentUser();
  const sendRequest = useSendFriendRequest();

  const { register, handleSubmit, reset, formState } = useForm<SendFriendRequestInput>({
    resolver: zodResolver(sendFriendRequestInputSchema),
    mode: 'onChange',
    defaultValues: { tag: '' }
  });

  const send = handleSubmit(({ tag }) => {
    sendRequest.mutate(
      { tag: tag.trim().toLowerCase() },
      {
        onSuccess: () => {
          reset();
          toast.success(t('requestSent'), { id: 'friend-request-send-by-tag' });
        },
        onError: (err: Error) => {
          toastError('friend-request-send-by-tag')(err);
        }
      }
    );
  });

  return (
    <div className={s.addPane}>
      <div className={s.addIntro}>
        <h2 className={s.addTitle}>{t('addFriend')}</h2>
        <p className={s.addHint}>{t('addFriendHint')}</p>
      </div>

      <form noValidate className={s.addForm} onSubmit={send}>
        <div className={s.addField}>
          <input
            className={s.addInput}
            placeholder={t('tagPlaceholder')}
            spellCheck={false}
            {...register('tag')}
          />

          <Button
            className={s.addSubmit}
            disabled={!formState.isValid || sendRequest.isPending}
            size='sm'
            type='submit'
          >
            {sendRequest.isPending ? <Spinner decorative /> : <UserPlus aria-hidden />}
            {t('sendByTag')}
          </Button>
        </div>
      </form>

      {friendTag && (
        <div className={s.addTagCard}>
          <div className={s.addTagCopy}>
            <p className={s.addTagTitle}>{t('yourTagTitle')}</p>
            <p className={s.addTagHint}>{t('yourTagHint')}</p>
          </div>

          <FriendTag tag={friendTag} />
        </div>
      )}
    </div>
  );
};
