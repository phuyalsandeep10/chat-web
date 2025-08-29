import ChatBox from '@/components/custom-components/ChatBox/ChatBox';
import { ChatBoxProvider } from '@/components/custom-components/ChatBox/chatbox.provider';
import { Suspense } from 'react';

const ChatPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatBoxProvider>
        <ChatBox />
      </ChatBoxProvider>
    </Suspense>
  );
};

export default ChatPage;
