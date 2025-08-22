import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Icons } from '@/components/ui/Icons';
import { useState } from 'react';
import Image from 'next/image';
import profile from '@/assets/images/profile.jpg';
import ShowTime from '@/lib/timeFormatUtils';
import { useConversationStore } from '@/store/inbox/agentConversationStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageItemProps {
  message: any;
  onReply: (messageText: string) => void;
}

const MessageItem = ({ message, onReply }: MessageItemProps) => {
  const handleReplyClick = () => {
    onReply(message);
  };
  const { customer } = useConversationStore();

  return (
    <div>
      {/* {message?.updated_at && (
        <div className="mb-4 flex items-center">
          <div className="bg-gray-light h-[0.5px] w-full"></div>
          <div className="text-gray-light text-center text-xs">
            {ShowTime(message?.updated_at)}
          </div>
          <div className="bg-gray-light h-[0.5px] w-full"></div>
        </div>
      )} */}

      <div
        className={`flex ${message?.user_id ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!message?.user_id && (
          <div className="bg-gray-light mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
            <span className="text-theme-text-dark text-xs font-medium">
              {customer?.name?.substring(0, 2)?.toLocaleUpperCase()}
            </span>
          </div>
        )}

        <div className="flex items-center">
          <div
            className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-sm ${
              message?.user_id
                ? 'bg-brand-primary px-5 py-2.5 text-white'
                : 'bg-brand-disable text-gray-dark'
            }`}
          >
            {message?.reply_to && message?.reply_to_id && (
              <div className="bg-brand-bg-gradient flex items-center justify-center overflow-hidden">
                <div className="w-full items-center rounded-[8px] border border-l-4 py-2.5 pr-7 pl-7">
                  <div className="flex items-center gap-3 text-sm font-semibold text-white">
                    <Icons.reply className="h-5 w-5" />
                    <span className="text-sm">Replied</span>
                  </div>
                  <p className="mt-1 text-sm font-normal text-white">
                    {message?.reply_to?.content}
                  </p>
                </div>
              </div>
            )}

            <p
              className={`${
                message?.user_id ? 'text-sm font-normal break-all' : 'text-sm'
              }`}
            >
              {message?.content}
            </p>
            {/* <p>{ShowTime(message?.updated_at)}</p> */}

            <div
              className={`mt-1 flex items-center ${message?.user_id ? 'justify-end' : ''}`}
            >
              <span
                className={`text-xs ${
                  message?.user_id ? 'text-white' : 'text-gray-dark'
                }`}
              ></span>
            </div>
          </div>

          <div className="">
            <Avatar>
              {message?.user && message?.user?.image ? (
                <AvatarImage
                  src={message?.user?.image}
                  alt="@shadcn"
                  className="ml-2 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
                />
              ) : (
                <AvatarFallback>
                  {message?.name?.substring(0, 2)?.toLocaleUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>

        {!message?.user_id && (
          <div className="transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-theme-text-primary flex h-6 w-6 cursor-pointer items-center justify-center transition-colors">
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                  Create a ticket
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2"
                  onClick={handleReplyClick}
                >
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem className="text-error focus:text-error flex cursor-pointer items-center gap-2">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* {message?.user_id && (
        <div className="-mt-2 mr-10 flex justify-end">
          <Icons.double_check className="text-brand-primary" />
        </div>
      )} */}
    </div>
  );
};

export default MessageItem;
