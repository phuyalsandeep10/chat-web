'use client';
import React, { useEffect, useRef, useState } from 'react';
import SubSidebarContentWrapper from '../CustomSidebar/SubSidebarContentWrapper';
import InboxChatSection from './InboxChatSection/InboxChatSection';
import InboxChatInfo from './InboxChatInfo/InboxChatInfo';
import InboxSubSidebar from './InboxSidebar/InboxSubSidebar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import io from 'socket.io-client';
import { useParams } from 'next/navigation';
import ReplyMessage from './ReplyMessage';

const socket = io('http://localhost:4000');

interface Message {
  id: number;
  sender: 'agent' | 'customer';
  message: string;
  time: string;
  date?: string;
}

const Inbox = () => {
  const params = useParams();
  const chatId = params?.userId;
  const inputRef = useRef<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!chatId) return;

    socket.emit('joinChat', chatId);

    const handleNewMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [chatId]);

  const onSend = () => {
    const text = inputRef.current?.value;
    if (text) {
      const messageId = crypto.randomUUID();
      const msg = {
        messageId,
        chatId,
        user: 'Me',
        message: text,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
        sender: 'customer',
      };

      setMessages((prev) => [...prev, msg]);
      socket.emit('sendMessage', msg);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex">
      <SubSidebarContentWrapper className="w-[306px]">
        <div className="flex">
          <InboxSubSidebar />
        </div>
      </SubSidebarContentWrapper>

      <div className="flex-1">
        <InboxChatSection messages={messages} />

        <div className="relative m-4">
          <ReplyMessage />
          <Textarea
            placeholder="Enter your message here"
            className="h-24"
            ref={inputRef}
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={onSend}>{'Send'}</Button>
          </div>
        </div>
      </div>
      <div className="w-[400px]">
        <InboxChatInfo />
      </div>
    </div>
  );
};

export default Inbox;
