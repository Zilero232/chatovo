'use client';

import type { ClipboardEvent } from 'react';

import { ATTACHMENT_MAX_BYTES, encodeChatAttachment } from '@chatovo/schemas';
import { useDropZone, useFileDialog } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { uploadChatAttachment } from '@/shared/api';

type UseChatFilesParams = {
  disabled: boolean;
  roomId: string;
  onSend: (value: string) => Promise<unknown>;
};

export const useChatFiles = ({ roomId, disabled, onSend }: UseChatFilesParams) => {
  const t = useTranslations('chat');
  const toastError = useToastError();

  const { isPending, mutate } = useMutation({
    mutationFn: async (files: File[]) => {
      for (const file of files) {
        const attachment = await uploadChatAttachment(roomId, file);

        await onSend(encodeChatAttachment(attachment));
      }
    },
    onError: (err: Error) => {
      toastError(`chat-upload-${roomId}`)(err);
    }
  });

  const sendFiles = (files: File[]) => {
    if (disabled || isPending || files.length === 0) {
      return;
    }

    const tooLarge = files.find((file) => file.size > ATTACHMENT_MAX_BYTES);

    if (tooLarge) {
      toast.error(t('fileTooLarge'), { id: `chat-file-too-large-${roomId}` });

      return;
    }

    mutate(files);
  };

  const { open } = useFileDialog((value) => {
    if (value) {
      sendFiles(Array.from(value));
    }
  });

  const sendFilesRef = useRef(sendFiles);

  sendFilesRef.current = sendFiles;

  const { ref, overed } = useDropZone<HTMLElement>((files) => {
    if (files) {
      sendFilesRef.current(files);
    }
  });

  const onPaste = (event: ClipboardEvent) => {
    const files = Array.from(event.clipboardData.files);

    if (files.length === 0) {
      return;
    }

    event.preventDefault();
    sendFiles(files);
  };

  return {
    isUploading: isPending,
    dropRef: ref,
    overed,
    onPaste,
    openPicker: open
  };
};
