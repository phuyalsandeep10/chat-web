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
import { IntegrationService } from '@/services/integration/IntegrationService';

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

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await IntegrationService.postTelegramDetails({
        display_name: data.displayName,
        token: data.token,
      });

      console.log('Telegram Installed:', response);

      reset();
      setOpen(false);
    } catch (err: any) {
      const apiError =
        err?.response?.data?.data ||
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong';
      setError(apiError);
    } finally {
      setLoading(false);
    }
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

          {error && <p className="text-alert-prominent text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Installing...' : 'Install Telegram'}
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
