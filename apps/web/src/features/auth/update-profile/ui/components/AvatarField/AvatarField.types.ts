export type AvatarFieldProps = {
  name: string;
  src: string | null;
  onPick: (file: File) => void;
  onRemove: () => void;
};
