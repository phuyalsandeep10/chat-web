'use client';

import { useVisitor } from '@/hooks/useVisitor.hook';
import { createContext, useContext } from 'react';

type ChatBoxContextType = {
  visitor: any | null;
  setVisitor: (any: any) => void;
};

const ChatBoxContext = createContext<ChatBoxContextType>({
  visitor: null,
  setVisitor: () => {},
});

export const ChatBoxProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { visitor, setVisitor, loading } = useVisitor();

  const isItHide = loading || !visitor;
  return (
    <ChatBoxContext.Provider
      value={{
        visitor,
        setVisitor,
      }}
    >
      {!isItHide ? children : <></>}
    </ChatBoxContext.Provider>
  );
};

export const useChatBox = () => {
  const context = useContext(ChatBoxContext);
  if (!context) {
    throw new Error('useChatBox must be used within a ChatBoxProvider');
  }
  return context;
};
