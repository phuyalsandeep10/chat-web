'use client';

import { useVisitor } from '@/hooks/useVisitor.hook';
import ChatBox from './ChatBox';

export const PublicChatProvider = () => {
  const { visitor, loading } = useVisitor();
  if (loading || !visitor) {
    return <></>;
  }
  return <ChatBox visitor={visitor} />;
};
