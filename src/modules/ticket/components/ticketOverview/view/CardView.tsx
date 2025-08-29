'use client';

import React, { useEffect, useState } from 'react';
import TicketCard from '@/modules/ticket/components/comman/ticketCard/TicketCard';
import TicketTabs from '@/modules/ticket/components/comman/ticketCard/TicketTabs';
import { Icons } from '@/components/ui/Icons';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useCardView } from './hooks/useCardView';
import DeleteModal from '@/components/modal/DeleteModal';
import Pagination from '@/components/common/pagination/Pagination';
import { useCreateTicketForm } from '../../Tickets/createTicketForm';
import { ReusableAssignModal } from '../../comman/AssignModal';
import { useTicketStore } from './apiCalls/updateAssign/ticketStore';
import { useUpdateTicket } from './apiCalls/updateAssign/useUpdateTicket';
import { showToast } from '@/shared/toast';

export default function CardView() {
  const f = useCreateTicketForm();
  const {
    statusLoading,
    statusError,
    ticketsLoading,
    ticketsError,
    selectedStatus,
    setSelectedStatus,
    tickets,
    checkedTickets,
    handleCheckChange,
    formatTimeAgo,
    selectedCountInCurrentTab,
    tabs,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
  } = useCardView();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const selectedTickets = tickets.filter((ticket) => checkedTickets[ticket.id]);

  const firstSelectedTicket =
    selectedTickets.length === 1 ? selectedTickets[0] : null;

  const { assignModalOpen, openAssignModal, closeAssignModal } =
    useTicketStore();
  const updateTicketMutation = useUpdateTicket();

  // Initialize form values when modal opens
  useEffect(() => {
    if (!isAssignModalOpen || !firstSelectedTicket) return;

    // Reset form with default values from first selected ticket
    f.reset({
      department_id: firstSelectedTicket.department?.id?.toString() || '',
      assignees:
        firstSelectedTicket.assignees?.map(
          (a: any) => a.user?.id?.toString() || a.id?.toString(),
        ) || [],
    });
  }, [isAssignModalOpen]); // Only runs when modal opens

  // Handle Assign confirm
  const handleAssign = async () => {
    if (!firstSelectedTicket) return;

    const assigneeIds: number[] =
      f.getValues('assignees')?.map((id: string) => Number(id)) || [];

    try {
      const response = await updateTicketMutation.mutateAsync({
        ticketId: firstSelectedTicket.id,
        data: { assignees: assigneeIds },
      });

      setIsAssignModalOpen(false);

      showToast({
        title: 'Ticket Updated',
        description: response?.message || 'Ticket assigned successfully',
        variant: 'success',
        position: 'top-right',
      });
    } catch (error: any) {
      console.error('Failed to assign ticket', error);

      showToast({
        title: 'Update Failed',
        description: error?.response?.data?.message || 'Something went wrong',
        variant: 'error',
        position: 'top-right',
      });
    }
  };
  if (statusLoading)
    return <div className="p-4">Loading ticket statuses...</div>;
  if (statusError)
    return <div className="text-alert-prominent p-4">Error loading tabs</div>;
  if (ticketsLoading) return <div className="p-4">Loading tickets...</div>;
  if (ticketsError)
    return (
      <div className="text-alert-prominent p-4">Error loading tickets</div>
    );

  return (
    <div className="pt-6 pb-10">
      {/* Tabs */}
      <TicketTabs
        tabs={tabs}
        selected={selectedStatus}
        onSelect={(status) => setSelectedStatus(status)}
      />

      {/* Selected count & actions */}
      {selectedCountInCurrentTab > 0 && (
        <div className="font-outfit mt-4 flex items-center justify-between text-base font-medium text-black">
          <span>
            {selectedCountInCurrentTab} ticket
            {selectedCountInCurrentTab > 1 ? 's' : ''} selected
          </span>

          <div className="text-gray-primary flex items-center gap-4.5">
            {selectedCountInCurrentTab > 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button>
                    <Icons.git_merge className="h-6 w-6 cursor-pointer" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Merge</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <Icons.arrow_left_right className="h-6 w-6 cursor-pointer" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Swap</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  disabled={selectedCountInCurrentTab > 1}
                  className={`h-6 w-6 ${
                    selectedCountInCurrentTab > 1
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  }`}
                >
                  <Icons.ri_user_fill className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Assign</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <Icons.error_warning2 className="h-6 w-6 cursor-pointer" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">More</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={openDeleteModal}>
                  <Icons.delete_bin_fill className="h-6 w-6 cursor-pointer" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Delete</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Ticket Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {tickets.length === 0 ? (
          <p>No Ticket Found.</p>
        ) : (
          currentTickets.map((ticket) => (
            <TicketCard
              key={ticket?.id}
              id={ticket?.id}
              email={ticket?.created_by?.email || 'No Email'}
              timeAgo={formatTimeAgo(ticket?.created_at)}
              title={ticket?.title}
              priority={ticket.priority?.name}
              priority_fg_color={ticket?.priority?.fg_color}
              priority_bg_color={ticket?.priority?.bg_color}
              status_fg_color={ticket?.status?.fg_color}
              status_bg_color={ticket?.status?.bg_color}
              status={ticket?.status?.name}
              created_by={ticket?.created_by?.name}
              assignees={ticket?.assignees || []}
              checked={checkedTickets[ticket?.id] || false}
              onCheckChange={(isChecked) =>
                handleCheckChange(ticket?.id, isChecked)
              }
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={tickets.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={closeDeleteModal}
        title="Are you sure?"
        TitleclassName="font-outfit font-medium text-base text-black"
        description={`Deleting this ticket is a permanent action and cannot be undone. This may result in the loss of important information and context related to the issue.`}
        descriptionColor="text-alert-prominent font-outfit text-xs font-normal"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        icon={''}
      />

      {/* Assign Modal */}
      <ReusableAssignModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        selectedItems={selectedTickets}
        control={f.control}
        onSubmit={handleAssign}
        disabled={selectedCountInCurrentTab > 1}
        fields={[
          {
            type: 'select',
            name: 'department_id',
            label: 'Teams',
            placeholder: 'Select Team',
            options: f.teams.map((team) => ({
              label: team.name,
              value: team.id.toString(),
            })),
            required: true,
          },
          {
            type: 'multiselect',
            name: 'assignees',
            label: 'Assignees',
            placeholder: f.membersLoading
              ? 'Loading members...'
              : 'Select Members',
            options: f.teamMembers.map((member: any) => ({
              label: member.user?.name || 'Unknown',
              value: (
                member.user?.id ||
                member.user_id ||
                member.id
              ).toString(),
            })),
          },
        ]}
      />
    </div>
  );
}
