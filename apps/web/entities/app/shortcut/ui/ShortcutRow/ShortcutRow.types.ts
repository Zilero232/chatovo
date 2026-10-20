export type ShortcutRowProps = {
  clearVisible: boolean;
  display: string;
  label: string;
  recording: boolean;
  showConflictHint: boolean;
  onClear: () => void;
  onRecord: () => void;
};
