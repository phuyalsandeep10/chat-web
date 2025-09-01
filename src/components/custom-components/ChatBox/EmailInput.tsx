import Image from 'next/image';
import React from 'react';

const EmailInput = () => {
  return (
    <div className="mt-4 flex gap-4">
      <div className="flex items-end">
        <div className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-full bg-[#5A189A]">
          <Image
            src="/widget-logo.svg"
            height={12}
            width={12}
            className="h-4 w-4"
            alt=""
          />
        </div>
      </div>
      <div className="font-inter space-y-2 rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] border border-[rgba(170,170,170,0.10)] bg-white px-2.5 py-2">
        {/* input email field */}
        <div className="flex w-full items-center">
          <input
            type="email"
            placeholder="Enter your Email"
            className="rounded-md border p-2 text-xs outline-none placeholder:text-xs"
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
