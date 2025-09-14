'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { useUiStore } from '@/store/UiStore/useUiStore';
import CreateTicketForm from '@/modules/ticket/components/CreateTicketForm';
import { Icons } from '@/components/ui/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const InboxChatSectionHeader = () => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const { openChatInfo } = useUiStore();
  const { customer, conversation, resolveConversation } =
    useAgentConversationStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-white p-4 pt-0">
      {/* Customer Info */}
      <div
        className="flex cursor-pointer items-center space-x-3"
        onClick={openChatInfo}
      >
        <div className="bg-gray-light flex h-10 w-10 items-center justify-center rounded-full">
          <span className="text-brand-dark text-sm font-medium">
            {customer?.name?.substring(0, 2)?.toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-brand-dark text-base font-semibold">
            {customer?.name}
          </h2>
          <p className="text-gray-primary text-xs font-normal">
            {customer?.email}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Create Ticket Button */}
        <Button
          className="bg-brand-primary flex gap-2 rounded-lg !px-4 !py-2 text-xs text-white"
          onClick={() => setIsTicketModalOpen(true)}
        >
          <Icons.ticket className="h-4 w-4" />
          Create a ticket
        </Button>

        {/* Quick Action Dropdown */}
        <div className="relative">
          <DropdownMenu
            open={isQuickActionOpen}
            onOpenChange={setIsQuickActionOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-light hover:text-theme-text-primary text-theme-text-primary flex cursor-pointer items-center gap-2 rounded-lg bg-transparent px-4 py-2 text-xs font-semibold hover:bg-transparent"
              >
                Quick action
                <ChevronDown className="text-gray-primary h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              {conversation?.is_resolved ? null : (
                <DropdownMenuItem
                  onClick={() => resolveConversation(Number(conversation?.id))}
                  className="text-brand-dark text-xs hover:bg-gray-50"
                >
                  Resolve
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-error text-xs hover:bg-red-50">
                Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Back Button */}
        <button
          className="text-gray-light cursor-pointer"
          onClick={openChatInfo}
        >
          <Icons.chevron_left className="h-5 w-5" />
        </button>
      </div>

      {/* Custom Modal */}
      {isTicketModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsTicketModalOpen(false)} // Click outside closes modal
        >
          <div
            className="relative w-full max-w-6xl rounded-md bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close Button
            <button
              onClick={() => setIsTicketModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button> */}

            {/* Modal Content */}
            <CreateTicketForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxChatSectionHeader;
