'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Icons } from '@/components/ui/Icons';
import { useSocket } from '@/context/socket.context';
import { CHAT_EVENTS } from '@/events/InboxEvents';
import { formatTime } from '@/lib/timeFormatUtils';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { MoreVertical } from 'lucide-react';
import { useEffect } from 'react';

interface MessageItemProps {
  message: any;
  onReply: (messageText: string) => void;
  handleEditMessage: (messageText: string) => void;
}

const MessageItem = ({
  message,
  onReply,
  handleEditMessage,
}: MessageItemProps) => {
  const handleReplyClick = () => {
    onReply(message);
  };
  const editMessageClick = () => {
    handleEditMessage(message);
  };
  const { socket } = useSocket();
  const { customer }: any = useAgentConversationStore();

  const isUserId = message?.user_id;

  // console.log(message);

  useEffect(() => {
    if (!socket) return;
    if (!isUserId && !message?.seen) {
      socket.emit(CHAT_EVENTS.message_seen, {
        message_id: message?.id,
      });
    }
  }, [message]);

  return (
    <div
      className={`flex ${isUserId ? 'justify-end' : 'justify-start'} mb-4`}
      key={message?.id}
    >
      {!isUserId && (
        <>
          <Avatar className="bg-gray-light mr-2 flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full">
            {message?.user && message?.user?.image ? (
              <AvatarImage
                src={message?.user?.image}
                alt="user image"
                className="ml-2 flex h-full w-full rounded-full object-center"
              />
            ) : (
              <AvatarFallback className="text-theme-text-dark h-full w-full text-xs font-medium">
                {customer?.name?.substring(0, 2)?.toLocaleUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          {/* <div className="bg-gray-light mr-2 flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full">
            <span className="text-theme-text-dark text-xs font-medium">
              {customer?.name?.substring(0, 2)?.toLocaleUpperCase()}
            </span>
          </div> */}
        </>
      )}

      <div className={`flex`}>
        <div className={`flex ${isUserId ? 'flex-col' : ''}`}>
          {message?.edited_content && (
            <div className="group relative mr-16 flex justify-end">
              <span className="text-info text-xs font-medium">Edited</span>
              <div className="text-info bg-info-light absolute top-[-30px] hidden rounded-lg px-3 py-1.5 text-xs break-all group-hover:block">
                <div
                  dangerouslySetInnerHTML={{ __html: message?.edited_content }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {isUserId && (
              <div className="transition-opacity duration-200">
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-theme-text-primary flex h-6 w-6 cursor-pointer items-center justify-center transition-colors">
                    <MoreVertical size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      className="hover:bg-secondary-disabled flex cursor-pointer items-center"
                      onClick={editMessageClick}
                    >
                      Edit Message
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem className="text-error focus:text-error flex cursor-pointer items-center gap-2">
                      Delete
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div
              className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-sm ${
                isUserId
                  ? 'bg-brand-primary px-5 py-2.5 text-white'
                  : 'bg-light-blue text-black'
              }`}
            >
              {message?.reply_to && message?.reply_to_id && (
                <div className="bg-brand-bg-gradient flex items-center justify-center overflow-hidden">
                  <div className="w-full items-center rounded-[8px] border border-l-4 py-2.5 pr-7 pl-7">
                    <div className="flex items-center gap-3 text-sm font-semibold text-white">
                      <Icons.reply className="h-5 w-5" />
                      <span className="text-sm">Replied</span>
                    </div>
                    <div className="mt-1 text-lg font-normal text-white">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message?.reply_to?.content,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`text-lg leading-[29px] font-normal ${
                  isUserId ? 'font-normal break-all' : ''
                } ${message?.reply_to && message?.reply_to_id && 'mt-1'}`}
              >
                <div
                  className="message__content prose prose-sm max-w-none break-all [&_ol]:list-decimal [&_ol]:pl-2 [&_ul]:list-disc [&_ul]:pl-2"
                  dangerouslySetInnerHTML={{ __html: message?.content }}
                />
              </div>
              <div
                className={`mt-1 flex items-center text-xs font-normal ${isUserId ? 'justify-start text-left text-white' : 'text-theme-text-primary justify-end'}`}
              >
                <span>{formatTime(message?.updated_at)}</span>
              </div>
            </div>

            <div>
              {isUserId && (
                <Avatar className="min-h-12 min-w-12 overflow-hidden">
                  {message?.user && message?.user?.image ? (
                    <AvatarImage
                      src={message?.user?.image}
                      alt="user image"
                      className="flex h-full w-full shrink-0 rounded-full object-center"
                    />
                  ) : (
                    <AvatarFallback className="text-theme-text-dark h-full w-full text-xs font-medium">
                      {message?.user?.name
                        ?.substring(0, 2)
                        ?.toLocaleUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
            </div>
          </div>
          <div>
            {isUserId && message?.seen && (
              <div className="mr-11 flex justify-end">
                <Icons.double_check className="text-brand-primary" />
              </div>
            )}
          </div>
        </div>

        {!isUserId && (
          <div className="transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-theme-text-primary flex h-6 w-6 cursor-pointer items-center justify-center transition-colors">
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {/* <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                  Create a ticket
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  className="text-brand-dark flex cursor-pointer items-center gap-2 text-xs"
                  onClick={handleReplyClick}
                >
                  Reply
                </DropdownMenuItem>
                {/* <DropdownMenuItem className="text-error focus:text-error flex cursor-pointer items-center gap-2">
                  Delete
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
