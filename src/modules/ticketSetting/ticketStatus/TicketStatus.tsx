'use client';

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/common/hook-form/InputField';
import { SelectField } from '@/components/common/hook-form/SelectField';
import AdvancedColorPicker from '@/modules/ticket/components/comman/AdvanceColorPicker';
import DeleteModal from '@/components/modal/DeleteModal';

import { useTicketStatusLogic } from './service/ticketStatusLogic';
import { Icons } from '@/components/ui/Icons';

export default function TicketStatus() {
  const logic = useTicketStatusLogic();

  return (
    <TooltipProvider>
      <div className="mb-6">
        <h1 className="text-brand-dark mb-1 text-xl font-semibold">
          Ticket Status
        </h1>
        <p className="font-outfit text-brand-dark text-xs font-normal">
          Define ticket progress stages, mark final states, and control customer
          visibility.
        </p>
      </div>

      <div className="space-y-5">
        {logic.statuses.map((status) =>
          status ? (
            <div
              key={status.id}
              className="border-theme-text-light flex items-center gap-4 rounded-lg border p-4"
            >
              <div className="cursor-move text-gray-400">
                <Icons.drag_move_fill size={24} />
              </div>

              <div className="flex">
                <div className="border px-1 py-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AdvancedColorPicker
                        color={status.bg_color || '#000000'}
                        onChange={(c) =>
                          logic.handleBackgroundColorChange(status.id, c)
                        }
                        tooltip="Background Color"
                      />
                    </TooltipTrigger>
                  </Tooltip>
                </div>
                <div className="border-t border-r border-b px-1 py-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AdvancedColorPicker
                        color={status.fg_color || '#ffffff'}
                        onChange={(c) =>
                          logic.handleForegroundColorChange(status.id, c)
                        }
                        tooltip="Text Color"
                      />
                    </TooltipTrigger>
                  </Tooltip>
                </div>
              </div>

              <div className="flex w-full justify-between gap-4 pr-12">
                {/* --- NAME --- */}
                <input
                  type="text"
                  value={status.name || ''}
                  onChange={(e) =>
                    logic.handleNameChange(status.id, e.target.value)
                  }
                  className="font-outfit text-disabled-foreground w-full rounded-md border px-3 py-2 text-sm font-medium"
                />

                {/* --- CATEGORY --- */}
                <div className="relative w-52">
                  <select
                    value={status.status_category || 'pending'}
                    onChange={(e) =>
                      logic.handleCategoryChange(status.id, e.target.value)
                    }
                    className="font-outfit text-disabled-foreground w-full appearance-none rounded-md border px-3 py-3 text-sm font-medium focus:outline-none"
                  >
                    {logic.categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <Icons.chevron_down
                    className="text-gray-primary pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                    size={18}
                  />
                </div>

                {/* --- DELETE --- */}
                <button
                  onClick={() => logic.handleOpenDeleteModal(status)}
                  className="text-alert-prominent cursor-pointer rounded-md p-2"
                >
                  <Icons.delete_bin_fill size={24} />
                </button>
              </div>
            </div>
          ) : null,
        )}

        {/* --- ADD NEW STATUS --- */}
        <form
          onSubmit={logic.handleSubmit(logic.handleAddStatus)}
          className="mt-6 mb-5"
        >
          <div className="flex items-start gap-4">
            <div className="font-outfit text-disabled-foreground h-9 flex-1 text-sm font-medium">
              <InputField
                control={logic.control}
                name="newStatusName"
                placeholder="New Status Name"
              />
            </div>
            <div className="font-outfit text-disabled-foreground min-w-[12rem] flex-1 text-sm font-medium">
              <SelectField
                control={logic.control}
                name="newCategoryName"
                options={logic.categoryOptions}
                className="break-words whitespace-normal"
              />
            </div>

            <div className="flex">
              <div className="border px-1 py-1">
                <AdvancedColorPicker
                  color={logic.newStatusBgColor || '#000000'}
                  onChange={logic.setNewStatusBgColor}
                  tooltip="Background Color"
                />
              </div>
              <div className="border-t border-r border-b px-1 py-1">
                <AdvancedColorPicker
                  color={logic.newStatusFgColor || '#ffffff'}
                  onChange={logic.setNewStatusFgColor}
                  tooltip="Text Color"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="hover:bg-brand-primary/90 cursor-pointer px-6 py-3 text-white"
            >
              <Icons.plus size={16} /> Add Status
            </Button>
          </div>
        </form>
      </div>

      <DeleteModal
        open={logic.deleteModalOpen}
        onOpenChange={logic.setDeleteModalOpen}
        title="Are you sure?"
        TitleclassName="font-outfit font-medium text-base text-black"
        description={`Deleting this ticket is a permanent action and cannot be undone. This may result in the loss of important information and context related to the issue.`}
        descriptionColor="text-alert-prominent font-outfit text-xs font-normal"
        onConfirm={logic.handleConfirmDelete}
        confirmText="Delete"
        icon={''}
      />
    </TooltipProvider>
  );
}
