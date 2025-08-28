// import React, { useEffect, useRef } from 'react';
// import { Message } from '@/store/inbox/types';
// import MessageItem from '@/components/custom-components/Inbox/InboxChatSection/MessageList/MessageItem';

// interface TicketInboxProps {
//   messages: Message[];
//   onReply: (messageText: string) => void;
// }

// const TicketInbox = ({ messages, onReply }: TicketInboxProps) => {
//   const endOfMessagesRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="flex-1 p-4">
//       <div className="max-h-[calc(100vh-280px)] min-h-[calc(100vh-280px)] space-y-4 overflow-y-auto py-10">
//         {messages?.map((message) => (
//           <MessageItem  message={message} onReply={onReply} />
//         ))}
//         <div ref={endOfMessagesRef} />
//       </div>
//     </div>
//   );
// };

// export default TicketInbox;
