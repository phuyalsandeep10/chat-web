'use client';

import React, { useState, useEffect } from 'react';
import TicketTabs from '@/modules/ticket/components/comman/ticketCard/TicketTabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Icons } from '@/components/ui/Icons';
import Pagination from '@/components/common/pagination/Pagination';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import DeleteModal from '@/components/modal/DeleteModal';
import { useCardView } from './hooks/useCardView';
import { cn } from '@/lib/utils';

export default function TableView() {
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
    deleteTicketName,
    handleConfirmDelete,
    isDeleting,
  } = useCardView();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset pagination when tickets or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tickets, selectedStatus]);

  if (statusLoading) return <div>Loading statuses...</div>;
  if (statusError)
    return <div className="text-red-500">Error loading statuses</div>;
  if (ticketsLoading) return <div>Loading tickets...</div>;
  if (ticketsError)
    return <div className="text-red-500">Error loading tickets</div>;

  return (
    <div className="pt-6">
      {/* Tabs */}
      <TicketTabs
        tabs={tabs}
        selected={selectedStatus}
        onSelect={setSelectedStatus}
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
                <button>
                  <Icons.ri_user_fill className="h-6 w-6 cursor-pointer" />
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

            {/* Delete */}
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

      {/* Table */}
      <div className="mt-6 border-b">
        <Table>
          <TableHeader className="bg-secondary-hover font-outfit h-[74px] text-xl font-semibold">
            <TableRow>
              <TableHead>
                <Checkbox
                  // className="bg-gray-primary ml-4"
                  className={cn(
                    'bg-gray-primary mt-2 h-5 w-5 rounded border',
                    'data-[state=checked]:bg-brand-primary',
                    'data-[state=checked]:border-brand-primary',
                  )}
                  checked={
                    currentTickets.length > 0 &&
                    currentTickets.every((ticket) => checkedTickets[ticket.id])
                  }
                  onCheckedChange={(checked) =>
                    currentTickets.forEach((ticket) =>
                      handleCheckChange(ticket.id, Boolean(checked)),
                    )
                  }
                />
              </TableHead>
              <TableHead>Ticket</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Time</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Checkbox
                    className={cn(
                      'bg-gray-primary mt-2 h-5 w-5 rounded border',
                      'data-[state=checked]:bg-brand-primary',
                      'data-[state=checked]:border-brand-primary',
                    )}
                    checked={checkedTickets[ticket.id] || false}
                    onCheckedChange={(checked) =>
                      handleCheckChange(ticket.id, Boolean(checked))
                    }
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-outfit text-base font-normal text-black">
                      {ticket?.title}
                    </div>
                    <div className="font-outfit text-xs font-normal">
                      Created From {ticket?.created_by?.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className="border-theme-text-light inline-flex items-center gap-2 rounded-md border-1 px-2 py-2"
                    style={{
                      color: ticket?.status?.fg_color,
                      backgroundColor: ticket.status.bg_color,
                    }}
                  >
                    <span
                      className="ml-4 inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: ticket?.status?.fg_color }}
                    ></span>
                    {ticket?.status?.name}
                  </div>
                </TableCell>
                <TableCell className="font-outfit text-base font-normal">
                  {formatTimeAgo(ticket?.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {ticket?.assignees?.map((assignee: any) => (
                      <Avatar
                        key={assignee.id}
                        className="h-10 w-10 border-2 border-white"
                      >
                        {assignee.image ? (
                          <AvatarImage
                            src={assignee.image}
                            alt={assignee.name}
                          />
                        ) : (
                          <AvatarFallback>
                            {assignee.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className="font-outfit rounded-2xl px-5 py-2 text-xs font-semibold"
                    style={{
                      backgroundColor: ticket?.priority?.bg_color,
                      color: ticket?.priority?.fg_color,
                    }}
                  >
                    {ticket.priority?.name}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={tickets.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      {/* Delete Modal */}
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
    </div>
  );
}
