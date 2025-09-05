import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useUiStore } from '@/store/UiStore/useUiStore';
import InboxChatInfo from './InboxChatInfo';

const InboxChatInfoDetails = () => {
  const { closeChatInfo, showChatInfo } = useUiStore();
  return (
    <Sheet open={showChatInfo} onOpenChange={() => closeChatInfo()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="">Customer Details</SheetTitle>
        </SheetHeader>
        <InboxChatInfo />
      </SheetContent>
    </Sheet>
  );
};

export default InboxChatInfoDetails;
