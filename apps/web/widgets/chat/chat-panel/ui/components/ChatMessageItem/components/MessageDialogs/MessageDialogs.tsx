'use client';

import { ReportAbuseDialog } from '@/features/social/report-abuse';

import { useChatMessage } from '../../../../../model/contexts';
import { DeleteMessageDialog } from '../DeleteMessageDialog/DeleteMessageDialog';
import { EditMessageDialog } from '../EditMessageDialog/EditMessageDialog';

export const MessageDialogs = () => {
  const {
    message,
    isEditing,
    setIsEditing,
    isConfirmingDelete,
    setIsConfirmingDelete,
    isReportingAbuse,
    setIsReportingAbuse,
    author,
    saveEdit,
    confirmDelete
  } = useChatMessage();

  return (
    <>
      <EditMessageDialog
        key={message.message}
        initialValue={message.message}
        open={isEditing}
        onOpenChange={setIsEditing}
        onSave={saveEdit}
      />

      <DeleteMessageDialog
        open={isConfirmingDelete}
        onConfirm={confirmDelete}
        onOpenChange={setIsConfirmingDelete}
      />

      <ReportAbuseDialog
        open={isReportingAbuse}
        target='message'
        targetId={message.id}
        targetName={author}
        onOpenChange={setIsReportingAbuse}
      />
    </>
  );
};
