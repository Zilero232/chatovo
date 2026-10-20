export type RemoveFriendConfirmDialogProps = {
  friendName: string;
  open: boolean;
  userId: string;
  onOpenChange: (open: boolean) => void;
};
