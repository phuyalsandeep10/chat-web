import React from 'react';
import InboxChatInfoHeader from './InboxChatInfoHeader';
import InboxChatInfoProfileInfo from './InboxChatInfoProfileInfo';
import ContactInfo from './Informations/ContactInfo';
import GeneralInfo from './Informations/GeneralInfo';
import DeviceInfo from './Informations/DeviceInfo';
import TagsInfo from './Informations/TagsInfo';
import RecentlyViewPagesInfo from './Informations/RecentlyViewPagesInfo';
import RecentActivityInfo from './Informations/RecentActivityInfo';
import SocialMedia from './Informations/SocialMedia';
import TitleReasonInfo from './Informations/TitleReasonInfo';
import { Icons } from '@/components/ui/Icons';
import { useUiStore } from '@/store/UiStore/useUiStore';
import Participants from './Informations/Participants';

const InboxChatInfo: React.FC = () => {
  const { closeChatInfo } = useUiStore();

  return (
    <div>
      <div className="font-outfit max-h-[90vh] overflow-y-auto bg-white">
        {/* Header */}
        {/* <InboxChatInfoHeader onClose={closeChatInfo} /> */}
        <div className="px-10 py-7">
          {/* Profile Section */}
          <InboxChatInfoProfileInfo />

          {/* Contact Information */}
          <ContactInfo />

          {/* General Information */}
          <GeneralInfo />

          {/* Device Information */}
          <DeviceInfo />

          {/* Tags */}
          {/* <TagsInfo /> */}

          {/* Recently Viewed Pages */}
          {/* <RecentlyViewPagesInfo /> */}
          {/* 
          <TitleReasonInfo
            icon={<Icons.user_check className="text-brand-dark h-4 w-4" />}
            title="Agent Memo"
            content="Investigating file upload issue. Might be a network problem."
          />

          <TitleReasonInfo
            icon={<Icons.message className="h-4 w-4" />}
            title="Related Conversations/Tickets"
            content="Investigating file upload issue. Might be a network problem."
          /> */}

          {/* participants */}
          <Participants />

          {/* Recent Activity */}
          {/* <RecentActivityInfo /> */}

          {/* Social Media */}
          {/* <SocialMedia /> */}
        </div>
      </div>
    </div>
  );
};

export default InboxChatInfo;
