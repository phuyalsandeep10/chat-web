import React, { FC } from 'react';
import { CoreCapabilitiesProps } from './types';

const CoreCapabilities: FC<CoreCapabilitiesProps> = ({ capabilities = [] }) => {
  return (
    <div className="border-gray-light w-[387px] flex-1 rounded-lg border pt-5 pr-16.5 pb-5 pl-5">
      <h1 className="text-brand-dark mb-5.5 text-xl leading-7.5 font-semibold">
        Core Capabilities
      </h1>

      <div className="flex flex-col gap-4">
        {capabilities.map(({ icon: Icon, title, description }, index) => (
          <div key={index} className="flex gap-1.5">
            <Icon className="text-brand-primary h-6 w-6" />
            <div>
              <p className="text-brand-dark text-base font-medium">{title}</p>
              <p className="text-sm font-normal">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoreCapabilities;
