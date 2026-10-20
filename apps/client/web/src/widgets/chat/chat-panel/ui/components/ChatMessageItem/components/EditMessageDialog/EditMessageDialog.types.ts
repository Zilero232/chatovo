export type EditMessageDialogProps = {
  initialValue: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (body: string) => void;
};
