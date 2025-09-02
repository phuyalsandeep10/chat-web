import Image from 'next/image';
import React from 'react';

const EmailInput = () => {
  return (
    <div className="mt-4 flex gap-4">
      <div className="flex items-end">
        <div className="flex items-center justify-center rounded-full">
          <Image
            src="/widget-logo-bottom.svg"
            height={12}
            width={12}
            className="-ml-5 h-18 w-18"
            alt="bot icon"
          />
        </div>
      </div>
      <div className="font-inter -ml-6 w-full space-y-2 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] border border-[rgba(170,170,170,0.10)] bg-white px-2.5 py-2">
        <p className="text-[11px]">
          Thank you for your message!😄 <br />
          How can I help you today?
        </p>
        {/* input email field */}

        <div className="flex w-full items-center">
          <input
            type="email"
            placeholder="Enter your Email"
            className="w-full rounded-md border p-2 text-xs outline-none placeholder:text-xs"
          />
        </div>
        <button
          type="submit"
          className="bg-brand-primary rounded-md border p-2 text-xs text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default EmailInput;
