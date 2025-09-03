'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/common/hook-form/InputField';
import { SelectField } from '@/components/common/hook-form/SelectField';
import AdvancedColorPicker from '@/modules/ticket/components/comman/AdvanceColorPicker';
import { usePrioritiesTicket } from './hooks/usePriorityTicket';
import { Icons } from '@/components/ui/Icons';
import DeleteModal from '@/components/modal/DeleteModal';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

//  Zod Schema for validation
const prioritySchema = z.object({
  newPriorityName: z
    .string()
    .min(2, 'Priority name must be at least 2 characters long')
    .max(50, 'Priority name must be under 50 characters'),
  level: z.string().nonempty('Please select a level'),
});

type PriorityFormData = z.infer<typeof prioritySchema>;

export default function TicketPriorityPage() {
  const {
    priorities,
    control,
    handleSubmit,
    newPriorityBgColor,
    newPriorityTextColor,
    setNewPriorityBgColor,
    setNewPriorityTextColor,
    levelOptions,
    updatePriorityName,
    updatePriorityColor,
    onAddPriority,
    isLoading,
    isError,
    error,
    deletePriorities,
    capitalizeFirstLetter,
  } = usePrioritiesTicket();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPriorityId, setSelectedPriorityId] = useState<number | null>(
    null,
  );

  //  Setup React Hook Form with Zod Resolver
  const {
    control: formControl,
    handleSubmit: formHandleSubmit,
    reset,
    formState: { errors },
  } = useForm<PriorityFormData>({
    resolver: zodResolver(prioritySchema),
    defaultValues: {
      newPriorityName: '',
      level: '',
    },
  });

  const openDeleteModal = (priorityId: number) => {
    setSelectedPriorityId(priorityId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPriorityId !== null) {
      deletePriorities([selectedPriorityId]);
    }
    setDeleteModalOpen(false);
    setSelectedPriorityId(null);
  };

  const handleAddPriority = (data: PriorityFormData) => {
    onAddPriority(data);
    reset();
  };

  if (isLoading) {
    return <div className="p-4">Loading priorities...</div>;
  }

  if (isError) {
    return (
      <div className="text-alert-prominent p-4">
        Error loading priorities: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <TooltipProvider>
        <div className="bg-white">
          {/* Header */}
          <div className="mb-5">
            <h1 className="font-outfit text-brand-dark mb-1 text-lg font-semibold">
              Ticket Priority
            </h1>
            <p className="font-outfit text-brand-dark text-xs font-normal">
              Customize priority levels, assign unique colors, and map default
              SLA values to reflect urgency.
            </p>
          </div>

          {/* Priority Items */}
          <div className="mb-8 space-y-4">
            {priorities.map((priority) => (
              <div key={priority.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex">
                    <div className="border px-1 py-1">
                      <AdvancedColorPicker
                        color={priority.bg_color}
                        onChange={(color) =>
                          updatePriorityColor(priority.id, 'bg', color)
                        }
                        tooltip={
                          <div className="text-sm font-medium">
                            Background Color
                          </div>
                        }
                      />
                    </div>
                    <div className="border-t border-r border-b px-1 py-1">
                      <AdvancedColorPicker
                        color={priority.fg_color}
                        onChange={(color) =>
                          updatePriorityColor(priority.id, 'fg', color)
                        }
                        tooltip={
                          <div className="text-sm font-medium">Text Color</div>
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={capitalizeFirstLetter(priority.name)}
                      onChange={(e) =>
                        updatePriorityName(priority.id, e.target.value)
                      }
                      className="font-outfit text-theme-text-primary w-full rounded-md border px-3 py-2 text-sm font-medium focus:ring-2"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteModal(Number(priority.id))}
                    className="text-alert-prominent hover:text-alert-prominent cursor-pointer hover:bg-white"
                  >
                    <Icons.ri_delete_bin_5_line className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/*  Add New Priority with Validation */}
          <div className="border-t pt-6">
            <form
              onSubmit={formHandleSubmit(handleAddPriority)}
              className="flex items-start gap-4"
            >
              <div className="flex-1">
                <InputField
                  control={formControl}
                  name="newPriorityName"
                  placeholder="New Priority Name"
                />
              </div>
              <div className="w-48">
                <SelectField
                  control={formControl}
                  name="level"
                  options={levelOptions}
                  placeholder="Level"
                />
              </div>
              <div className="flex">
                <div className="border px-1 py-1">
                  <AdvancedColorPicker
                    color={newPriorityBgColor}
                    onChange={setNewPriorityBgColor}
                    tooltip={
                      <div className="text-sm font-medium">
                        Background Color
                      </div>
                    }
                  />
                </div>
                <div className="border-t border-r border-b px-1 py-1">
                  <AdvancedColorPicker
                    color={newPriorityTextColor}
                    onChange={setNewPriorityTextColor}
                    tooltip={
                      <div className="text-sm font-medium">Text Color</div>
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="hover:bg-brand-primary/90 cursor-pointer px-6 py-3 text-white"
              >
                <Icons.plus className="mr-2 h-4 w-4" />
                Add Status
              </Button>
            </form>
          </div>
        </div>
      </TooltipProvider>

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Are you sure?"
        TitleclassName="font-outfit font-medium text-base text-black"
        description={`Deleting this ticket is a permanent action and cannot be undone. This may result in the loss of important information and context related to the issue.`}
        descriptionColor="text-alert-prominent font-outfit text-xs font-normal"
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        icon={''}
      />
    </>
  );
}
