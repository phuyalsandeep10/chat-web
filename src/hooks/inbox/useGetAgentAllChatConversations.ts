import { useQuery } from '@tanstack/react-query';
import { ConversationService } from '@/services/inbox/agentCoversation.service';

export const useGetAgentAllChatConversations = () => {
  return useQuery({
    queryKey: ['agetAllChatConversastions'],
    queryFn: ConversationService.getAllChatConversations,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
