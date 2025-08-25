import AlertDialogDemo, {
  AlertDialogDemoRef,
} from '@/components/modal/AlertModal';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '@/components/common/hook-form/InputField';
import { showToast } from '@/shared/toast';
import axiosInstance from '@/apiConfigs/axiosInstance';

type FormData = {
  workspaceId: string;
};

const TerminateWorkspace = () => {
  const dialogRef = useRef<AlertDialogDemoRef>(null);

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      workspaceId: '',
    },
  });

  const handleDeleteClick = async (data: string) => {
    dialogRef.current?.open();
    try {
      const response = await axiosInstance.post(
        '/organizations/delete-workspace',
        {
          identifier: data,
        },
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // This function runs when user clicks "Yes, Delete" in modal
  const handleConfirmDelete = handleSubmit((data) => {
    console.log('Typed confirmation:', data.workspaceId);

    // Show toast success message
    showToast({
      title: 'Deleted Successfully',
      description: 'Workspace has been deleted',
      variant: 'success',
      position: 'top-right',
    });

    dialogRef.current?.close();
  });

  const handleCancelDelete = () => {
    console.log('Delete cancelled');
    dialogRef.current?.close();
  };

  return (
    <div>
      <div className={cn('mt-10')}>
        <div className="">
          <div className={cn('flex items-start')}>
            <div className={cn('flex-1')}>
              <h3
                className={cn(
                  'font-outfit text-brand-dark mb-3 text-xl leading-[30px] font-semibold',
                )}
              >
                Terminate Workspace
              </h3>
              <p
                className={cn(
                  'font-outfit text-disabled-foreground text-xs font-normal',
                )}
              >
                Proceed with Caution. These actions are irreversible.
              </p>

              <div className={cn('mt-6 space-y-7.5')}>
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor="workspace-id"
                    className={cn(
                      'font-outfit text-brand-dark text-base leading-[16px] font-medium',
                    )}
                  >
                    Enter Workspace ID
                  </label>
                  <input
                    id="workspace-id"
                    placeholder="Bramhabyfields"
                    className={cn(
                      'mt-2.5 h-9 w-1/2 rounded border border-gray-300 px-2',
                    )}
                  />
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(getValues('workspaceId'))}
                  className={cn(
                    'font-outfit mb-5 cursor-pointer text-xs leading-[16px] font-semibold',
                  )}
                >
                  Delete workspace
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialogDemo
        ref={dialogRef}
        heading="Are you sure?"
        subheading="You are going to delete “Bramhabytelab” workspace. This action is irreversible"
        icon={<Icons.alert className="text-alert-prominent mt-0.5" size={20} />}
        cancelText="Cancel"
        actionText="Yes, Delete"
        onCancel={handleCancelDelete}
        onAction={handleConfirmDelete} // <- Important: hook the confirm handler here
        descriptionClassName="font-outfit font-normal text-xs leading-[17px] text-alert-prominent w-[65%] mt-3"
        cancelButtonProps={{ variant: 'outline' }}
        actionButtonProps={{ variant: 'destructive' }}
        cancelClassName="cursor-pointer"
        actionClassName="cursor-pointer"
      >
        <div className="pt-6">
          <InputField
            control={control}
            name="workspaceId"
            required
            placeholder="DELETE"
            label="Type “DELETE” to confirm"
            className="w-full"
            inputClassName="h-9"
            labelClassName="font-outfit font-normal text-xs leading-[17px] text-disabled-foreground"
          />
        </div>
      </AlertDialogDemo>
    </div>
  );
};

export default TerminateWorkspace;
