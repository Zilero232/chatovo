export type BlockUserConfirmDialogProps = {
  open: boolean;
  userId: string;
  userName: string;
  onOpenChange: (open: boolean) => void;
};
