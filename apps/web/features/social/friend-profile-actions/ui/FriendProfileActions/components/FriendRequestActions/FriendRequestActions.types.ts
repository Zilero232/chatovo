export type AddFriendActionProps = {
  isBusy: boolean;
  onAdd: () => void;
};

export type CancelRequestActionProps = {
  isBusy: boolean;
  onCancel: () => void;
};

export type IncomingRequestActionsProps = {
  isBusy: boolean;
  onAccept: () => void;
  onDecline: () => void;
};
