'use client';

import React from 'react';
import { Controller } from 'react-hook-form';
import { TicketFormData } from '@/modules/ticket/types/ticket.schema';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import { TextAreaField } from '@/components/common/hook-form/TextAreaField';
import { SelectField } from '@/components/common/hook-form/SelectField';
import { MultiSelectField } from '@/components/common/hook-form/MultipleSelect';
import { InputField } from '@/components/common/hook-form/InputField';
import MultiImageUploader from './comman/MultipleImageuploader';
import { EmailSelectorField } from './comman/EmailSection';
import NewCustomerFields from './extraField/NewCustomerField';
import { useCreateTicketForm } from './Tickets/createTicketForm';
const CreateTicketForm = () => {
  const f = useCreateTicketForm();
  if (f.prioritiesLoading || f.teamsLoading || f.isCreating) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Icons.loader className="text-brand-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (f.prioritiesError || f.teamsError) {
    return <div className="text-alert-prominent text-base">Error Loading</div>;
  }
  return (
    <>
      <div
        className={cn(
          'border-gray-primary shadow-gray-primary rounded-md px-9 pb-8 shadow-md',
        )}
      >
        <h2
          className={cn(
            'font-outfit text-brand-dark pt-8 pb-5 text-xl leading-[30px] font-semibold',
          )}
        >
          Create New Ticket
        </h2>

        <form onSubmit={f.handleSubmit(f.onSubmit)}>
          <div className="grid grid-cols-3 gap-x-5 gap-y-5">
            {/* Ticket Title */}
            <InputField
              control={f.control}
              name="title"
              label="Ticket Title"
              placeholder="Write a ticket title"
              required
              inputClassName={cn(
                ' placeholder:text-gray-primary focus:ring-gray-primary w-full rounded-md py-2',
              )}
              labelClassName={cn(
                'text-brand-dark font-outfit text-sm font-semibold',
              )}
            />
            {/* Customer Email */}
            <EmailSelectorField
              control={f.control}
              name="customer_email"
              label="Customer's Email"
              required
              options={f.customerOptions}
              isAddingNew={f.isAddingNewEmail}
              setIsAddingNew={f.setIsAddingNewEmail}
              open={f.emailPopoverOpen}
              setOpen={f.setEmailPopoverOpen}
              error={f.errors.customer_email?.message}
            />
            {/* Priority */}
            <SelectField<TicketFormData>
              control={f.control}
              LabelClassName="text-brand-dark font-outfit font-semibold text-sm"
              name="priority_id"
              label="Priority"
              required
              options={f.priorityOptions.map((opt) => {
                const color = f.priorityColorMap[opt.value];
                return {
                  ...opt,
                  label: (
                    <span
                      className="inline-block rounded px-2 py-1 text-sm font-medium"
                      style={{
                        backgroundColor: color?.bg,
                        color: color?.fg,
                      }}
                    >
                      {opt.label}
                    </span>
                  ),
                };
              })}
            />
            {f.isAddingNewEmail && (
              <>
                <NewCustomerFields control={f.control} />
              </>
            )}
            {/* Sender's Domain */}
            <InputField
              control={f.control}
              name="sender_domain"
              label="Sender&#39;s Domain"
              placeholder="Sender's email"
              required
              inputClassName={cn(
                'placeholder:text-gray-primary focus:ring-gray-primary w-full rounded-md py-2',
              )}
              labelClassName={cn(
                'text-brand-dark font-outfit text-sm font-semibold',
              )}
            />
            {/* Teams */}
            <SelectField<TicketFormData>
              control={f.control}
              LabelClassName="text-brand-dark font-outfit font-semibold text-sm"
              name="department_id"
              label="Teams"
              placeholder="Select Team"
              required
              options={f.teams.map((team) => ({
                value: team.id.toString(),
                label: team.name,
              }))}
            />
            {/* Assignees */}
            <MultiSelectField
              name="assignees"
              control={f.control}
              LabelClassName="text-brand-dark font-outfit font-semibold text-sm"
              label="Assignees"
              placeholder={
                f.membersLoading ? 'Loading members...' : 'Select Members'
              }
              options={f.teamMembers.map((member: any) => {
                const id = member.user?.id || member.user_id || member.id || ''; // Adjust based on your API
                return {
                  label: member.user?.name || 'Unknown',
                  value: id.toString(),
                };
              })}
            />
            {/* Description */}
            <TextAreaField
              control={f.control}
              name="description"
              labelClassName="text-brand-dark font-outfit font-semibold text-sm pb-2 leading-[21px]"
              textareaClassName="h-[122px] border-gray-light resize-none"
              label="Ticket Remarks/Description"
              placeholder="Description"
              required
            />
            {/* Notes */}
            <TextAreaField
              control={f.control}
              name="notes"
              labelClassName="text-brand-dark font-outfit font-semibold text-sm pb-2 leading-[21px]"
              textareaClassName="h-[122px] border-gray-light resize-none"
              label="Internal Notes"
              placeholder="Note to Agent"
            />
            {/* Attachment */}
            <div className="pt-2">
              <Controller
                name="attachment"
                control={f.control}
                render={({ field }) => (
                  <MultiImageUploader
                    label="Add Attachment"
                    onImagesSelect={(imageDataUrls) => {
                      field.onChange(imageDataUrls);
                      f.setPreviewImages(imageDataUrls);
                    }}
                    previewImages={f.previewImages}
                    wrapperClassName="border-dashed border-2 border-gray-300 h-[122px] w-full flex items-center justify-center"
                    descriptionText=""
                  />
                )}
              />
            </div>
          </div>
          <div className="items-cente flex justify-between">
            <button
              type="submit"
              disabled={f.isCreating}
              className={cn(
                'bg-brand-primary font-outfit mt-4 h-12 w-[240px] cursor-pointer rounded-md px-6 py-2 text-base leading-[19px] font-semibold text-white',
                f.isCreating && 'cursor-not-allowed opacity-50',
              )}
            >
              {f.isCreating ? (
                <Icons.loader className="mr-2 inline-block h-5 w-5 animate-spin" />
              ) : null}
              Create Ticket
            </button>
            <div className="mt-5 text-right text-sm font-medium">
              {!f.isAddingNewEmail && f.selectedEmail ? (
                <div className="flex flex-col items-end space-y-1">
                  <span className="bg-info-light text-info font-outfit flex h-8 w-[164px] gap-2 rounded-md px-2 py-1.5 text-center text-sm font-semibold">
                    <span className="h-6 w-6">
                      <Icons.checbox_circle />
                    </span>
                    Existing customer
                  </span>
                  <span className="font-outfit text-info text-sm font-semibold">
                    Cunstomer Since :{' '}
                    {(() => {
                      const customer = f.customers.find(
                        (c: any) => c.email === f.selectedEmail,
                      );
                      if (!customer) return 'N/A';
                      // Format date, e.g. "Aug 8, 2025"
                      const createdDate = new Date(customer.created_at);
                      return createdDate.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      });
                    })()}
                  </span>
                </div>
              ) : null}

              {f.isAddingNewEmail ? (
                <span className="font-outfit text-warning-prominent bg-warning-prominent-bg flex items-center gap-2 rounded-md px-4 py-1 text-sm font-semibold">
                  <span>
                    <Icons.error_warning />
                  </span>
                  Non Existing Customer
                </span>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTicketForm;
