'use client';

import { useVisitor } from '@/hooks/useVisitor.hook';
import { createContext, useContext } from 'react';

type ChatBoxContextType = {
  visitor: any | null;
  error: boolean;
  setVisitor: (any: any) => void;
};

const ChatBoxContext = createContext<ChatBoxContextType>({
  visitor: null,
  error: false,
  setVisitor: () => {},
});

export const ChatBoxProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { visitor, setVisitor, loading, error } = useVisitor();

  const isItHide = loading || !visitor;
  return (
    <ChatBoxContext.Provider
      value={{
        visitor,
        setVisitor,
        error,
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
