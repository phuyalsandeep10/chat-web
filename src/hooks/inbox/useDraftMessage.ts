import { useEffect, useState } from 'react';

interface DraftData {
  message: string | null;
  replyingTo: any | null;
}

export const useDraftMessage = (
  chatId: string | number | null,
  editorRef: any,
) => {
  const [message, setMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);

  // Load draft on mount / chatId change
  useEffect(() => {
    if (!chatId) return;

    const savedDraft = localStorage.getItem(`draft-${chatId}`);
    if (savedDraft) {
      try {
        const parsedDraft: DraftData = JSON.parse(savedDraft);

        if (parsedDraft.message) {
          setMessage(parsedDraft.message);
          editorRef.current?.commands?.setContent(parsedDraft.message);
        }
        if (parsedDraft.replyingTo) {
          setReplyingTo(parsedDraft.replyingTo);
        }
      } catch (err) {
        console.error('Failed to parse draft:', err);
      }
    }
  }, [chatId]);

  // Persist draft whenever state changes
  useEffect(() => {
    if (!chatId) return;

    if (message || replyingTo) {
      const draft: DraftData = { message, replyingTo };
      localStorage.setItem(`draft-${chatId}`, JSON.stringify(draft));
    } else {
      localStorage.removeItem(`draft-${chatId}`);
    }
  }, [message, replyingTo, chatId]);

  const clearDraft = () => {
    setMessage(null);
    setReplyingTo(null);
    if (chatId) localStorage.removeItem(`draft-${chatId}`);
  };

  return {
    message,
    setMessage,
    replyingTo,
    setReplyingTo,
    clearDraft,
  };
};
