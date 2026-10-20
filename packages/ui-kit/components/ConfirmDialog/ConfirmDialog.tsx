'use client';

import { AlertTriangle } from 'lucide-react';

import type { ConfirmDialogProps } from './ConfirmDialog.types';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHint,
  DialogTitle,
  Spinner
} from '../../primitives';

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  cancelLabel,
  confirmLabel,
  confirmVariant = 'destructive',
  icon,
  tone,
  hint,
  isPending = false,
  onConfirm
}: ConfirmDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader
        icon={icon ?? <AlertTriangle />}
        tone={tone ?? (confirmVariant === 'destructive' ? 'destructive' : 'violet')}
      >
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      {children}

      {hint && <DialogHint>{hint}</DialogHint>}

      <DialogFooter>
        <Button
          disabled={isPending}
          type='button'
          variant='outline'
          onClick={() => onOpenChange(false)}
        >
          {cancelLabel}
        </Button>
        <Button disabled={isPending} type='button' variant={confirmVariant} onClick={onConfirm}>
          {isPending && <Spinner decorative />}
          {confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
