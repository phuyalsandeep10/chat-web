'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Icons } from '@/components/ui/Icons';
import { Button, type ButtonProps } from '@/components/ui/button';
interface DeleteModalProps {
  trigger?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  cancelVariant?: ButtonProps['variant'];
  confirmVariant?: ButtonProps['variant'];
  cancelSize?: ButtonProps['size'];
  confirmSize?: ButtonProps['size'];
  onCancel?: () => void;
  onConfirm?: () => void;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  descriptionColor?: string;
}
const DeleteModal: React.FC<DeleteModalProps> = ({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Delete Ticket',
  cancelVariant = 'outline_gray',
  confirmVariant = 'destructive',
  cancelSize,
  confirmSize,
  icon,
  iconBgColor,
  iconColor,
  descriptionColor,
  onCancel,
  onConfirm,
}) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="flex w-[326px] flex-col items-center text-center">
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div
          className={`flex h-[52px] w-[52px] items-center justify-center rounded-full ${iconBgColor ?? 'bg-error-light'}`}
        >
          {icon ?? (
            <Icons.ri_delete_bin_7_fill
              className={iconColor ?? 'text-alert-prominent'}
            />
          )}
        </div>
        <div>
          <p className="mb-[8px] text-[16px] leading-[26px] font-medium">
            {title}
          </p>
          <p
            className={`text-[12px] leading-[17px] ${descriptionColor ?? 'text-alert-prominent'}`}
          >
            {description}
          </p>
        </div>
        <div className="w-full">
          <div className="flex justify-between gap-4">
            <Button
              variant={cancelVariant}
              size={cancelSize}
              onClick={handleCancel}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant}
              size={confirmSize}
              onClick={handleConfirm}
              className="flex-1"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteModal;
