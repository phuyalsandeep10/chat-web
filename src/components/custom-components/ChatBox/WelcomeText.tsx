import Image from 'next/image';
import React from 'react';

const WelcomeText = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // convert 0 to 12 for 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const currentTime = `${hours}:${formattedMinutes} ${ampm}`;
  return (
    <div className="flex gap-2">
      <div className="flex items-center justify-center rounded-full">
        <Image
          src="/widget-logo-message.svg"
          height={32}
          width={32}
          className="shrink-0"
          alt="bot icon"
        />
      </div>
      <div className="font-inter rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px] border border-[rgba(170,170,170,0.10)] bg-white px-2.5 py-2">
        <p className="text-xs leading-[18px] font-normal text-black">
          Hi there! Welcome to ChatBoq! What would you like to do today?{' '}
        </p>
        <p className="mt-[5px] text-xs font-normal text-[#6D6D6D]">
          {currentTime}
        </p>
      </div>
    </div>
  );
};

export default WelcomeText;
