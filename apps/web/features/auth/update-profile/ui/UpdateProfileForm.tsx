'use client';

import { SubmitButton } from '@chatovo/ui-kit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { ProfileValues } from '@/entities/auth/user';

import { useToastError } from '@/entities/app/locale';
import { profileSchema, useCurrentUser, useUpdateProfile } from '@/entities/auth/user';

import { useAvatarDraft } from '../model/hooks';
import { AvatarField, ProfileFields } from './components';

import s from './UpdateProfileForm.module.scss';

export const UpdateProfileForm = () => {
  const t = useTranslations('settings.profile');
  const toastError = useToastError();

  const { displayName, profileUrl, avatarUrl, bannerColor, bio } = useCurrentUser();
  const { isPending, mutate } = useUpdateProfile();

  const avatar = useAvatarDraft(avatarUrl);

  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName,
      profileUrl: profileUrl ?? '',
      bannerColor,
      bio: bio ?? ''
    }
  });

  const onSubmit = handleSubmit((values) => {
    mutate(
      { ...values, avatar: avatar.value },
      {
        onSuccess: () => {
          toast.success(t('saved'), { id: 'update-profile' });
          reset(values);
          avatar.reset();
        },
        onError: toastError('update-profile')
      }
    );
  });

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <AvatarField
        name={displayName}
        src={avatar.shownSrc}
        onPick={avatar.pick}
        onRemove={avatar.remove}
      />

      <ProfileFields control={control} errors={errors} register={register} />

      <SubmitButton
        className={s.submit}
        disabled={!(isDirty || avatar.changed)}
        isPending={isPending}
      >
        {t('save')}
      </SubmitButton>
    </form>
  );
};
