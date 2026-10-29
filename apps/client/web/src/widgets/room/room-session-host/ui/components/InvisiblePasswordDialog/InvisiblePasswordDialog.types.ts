export type InvisiblePasswordDialogProps = {
  isPending: boolean;
  isWrong: boolean;
  roomName: string;
  onCancel: () => void;
  onSubmit: (password: string) => void;
};
