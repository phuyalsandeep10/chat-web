'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { InputField } from '@/components/common/hook-form/InputField';

const installTelegramSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  token: z.string().min(1, 'Token is required'),
});

type FormData = z.infer<typeof installTelegramSchema>;

type InstallChannelModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const InstallChannelModal: React.FC<InstallChannelModalProps> = ({
  open,
  setOpen,
}) => {
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(installTelegramSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Telegram Bot Data:', data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[374px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            Install Telegram
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            control={control}
            name="displayName"
            label="Enter Bot display name."
            labelClassName="font-medium text-base"
          />

          <InputField
            control={control}
            name="token"
            label="Enter generated token."
            labelClassName="font-medium text-base"
          />

          <Button type="submit" className="w-full">
            Install Telegram
          </Button>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstallChannelModal;
