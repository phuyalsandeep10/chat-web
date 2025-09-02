'use client';
import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Icons } from '../ui/Icons';
import { Button, type ButtonProps } from '../ui/button';
import { cn } from '@/lib/utils';
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
  DescriptionIcons?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  descriptionColor?: string;
  TitleclassName?: string;
}
const DeleteModal: React.FC<DeleteModalProps> = ({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  cancelText = 'Cancel',
  confirmText,
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
  TitleclassName,
  DescriptionIcons,
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
      <DialogContent
        transparent
        className={cn(`${TitleclassName} z-[9999] flex w-[568px] flex-col`)}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        {icon ?? (
          <div
            className={`flex h-[52px] w-[52px] items-center justify-center rounded-full ${iconBgColor ?? 'bg-error-light'}`}
          >
            <Icons.ri_delete_bin_7_fill
              className={iconColor ?? 'text-alert-prominent'}
            />
          </div>
        )}
        <div>
          <p className="mb-2 text-[16px] leading-[26px] font-medium">{title}</p>

          <p
            className={`flex text-xs leading-4 ${descriptionColor ?? 'text-alert-prominent'}`}
          >
            <span>{DescriptionIcons ?? <Icons.alert className="mr-2" />}</span>
            {description}
          </p>
        </div>
        <div className="flex justify-end">
          <div className="flex w-[272px] justify-between gap-4">
            <Button
              variant={cancelVariant}
              size={cancelSize}
              onClick={handleCancel}
              className="ring-brand-primary text-brand-primary font-outfit flex-1 cursor-pointer text-xs font-semibold ring-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant}
              size={confirmSize}
              onClick={handleConfirm}
              className="flex-1 cursor-pointer"
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
