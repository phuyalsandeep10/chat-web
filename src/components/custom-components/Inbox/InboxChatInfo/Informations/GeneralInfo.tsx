import React, { useEffect, useState } from 'react';
import InformationsWrapper from './InformationsWrapper';
import { Icons } from '@/components/ui/Icons';
import { useAgentConversationStore } from '@/store/inbox/agentConversationStore';

const GeneralInfo = () => {
  const { customer } = useAgentConversationStore();
  const [localTime, setLocalTime] = useState<string>();

  useEffect(() => {
    function getCurrentTimeWithOffset(): string {
      const now = new Date();

      // Time parts
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12;

      // Add leading zeros
      const hh = String(hours).padStart(2, '0');
      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');

      // Timezone offset
      const offsetMinutes = -now.getTimezoneOffset();
      const offsetHours = Math.floor(offsetMinutes / 60);
      const offsetSign = offsetHours >= 0 ? '+' : '-';

      return `${hh}:${mm}:${ss} ${ampm} (UTC${offsetSign}${Math.abs(offsetHours)})`;
    }

    setLocalTime(getCurrentTimeWithOffset());

    const interval = setInterval(() => {
      setLocalTime(getCurrentTimeWithOffset());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <InformationsWrapper>
      <div className="">
        <h5 className="text-theme-text-dark flex items-center gap-2 font-medium">
          <Icons.error_warning className="h-6 w-6" />
          General Information
        </h5>
        <div className="flex flex-col gap-1">
          <div className="mt-3 flex items-center gap-1">
            <span className="text-brand-dark text-sm leading-21 font-semibold">
              Location:
            </span>
            <span className="text-brand-dark text-sm font-normal">
              {customer?.attributes?.log?.city},{' '}
              {customer?.attributes?.log?.country}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-brand-dark text-sm leading-21 font-semibold">
              Last Active:
            </span>
            <span className="text-brand-dark text-sm font-normal">
              {/* conversion to localDateString */}
              {customer?.attributes?.log?.left_at &&
                new Date(customer.attributes.log.left_at).toLocaleDateString(
                  'en-US',
                  { weekday: 'long' },
                )}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-brand-dark text-sm leading-21 font-semibold">
              Local Time:
            </span>
            <span className="text-brand-dark text-sm font-normal">
              {localTime}
            </span>
          </div>
        </div>
      </div>
    </InformationsWrapper>
  );
};

export default GeneralInfo;
