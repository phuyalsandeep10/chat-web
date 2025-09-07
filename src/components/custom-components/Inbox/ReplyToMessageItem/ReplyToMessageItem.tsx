import React from 'react';
interface ReplyToMessageItemProps {
  replyingTo: {
    content?: string;
  };
  clearReply: () => void;
}

const ReplyToMessageItem = ({
  replyingTo,
  clearReply,
}: ReplyToMessageItemProps) => {
  return (
    <div className="bg bg-brand-disable relative ml-4 flex w-fit items-center justify-between rounded-md border px-4 py-2 text-black">
      <div className="flex items-center gap-2">
        <span className="text-xs text-black">Replying to:</span>
        <span className="text-theme-text-primary max-w-[200px] truncate text-xs font-medium">
          {replyingTo?.content}
        </span>
      </div>
      <button
        onClick={clearReply}
        className="text-theme-text-primary hover:text-brand-dark ml-2 text-sm"
      >
        ×
      </button>
    </div>
  );
};

export default ReplyToMessageItem;
