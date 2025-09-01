import React from 'react';
import InformationsWrapper from './InformationsWrapper';
import { User } from 'lucide-react';
import { Icons } from '@/components/ui/Icons';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Participants = () => {
  const { members } = useAgentConversationStore();
  return (
    <InformationsWrapper>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User />
            <h2 className="font-semibold">Participants</h2>
          </div>
          <Icons.plus_circle className="text-theme-text-dark h-5 w-5 cursor-pointer" />
        </div>

        <div className="mt-3 flex gap-4 px-2">
          {members?.map((memb) => (
            <Avatar key={memb.id} className="h-10 w-10">
              <AvatarImage
                src={memb?.user?.image ?? ''}
                alt={memb?.user?.name ?? 'User'}
              />
              <AvatarFallback>
                {memb?.user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </InformationsWrapper>
  );
};

export default Participants;
