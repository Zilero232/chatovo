export type ImageLightboxProps = {
  height: number;
  name: string;
  open: boolean;
  size: number;
  src: string;
  unoptimized: boolean;
  width: number;
  onOpenChange: (open: boolean) => void;
};
