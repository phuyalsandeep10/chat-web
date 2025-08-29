import { PublicChatProvider } from '@/components/custom-components/ChatBox/public.chat.provider';
import { Suspense } from 'react';

const ChatPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PublicChatProvider />
    </Suspense>
  );
};

export default ChatPage;
