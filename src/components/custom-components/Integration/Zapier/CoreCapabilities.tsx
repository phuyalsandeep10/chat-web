import { Icons } from '@/components/ui/Icons';
import React from 'react';

const capabilities = [
  {
    icon: Icons.ri_magic_line,
    title: 'Automated Messaging',
    description:
      'Engage customer instantly with pre-defined responses and dynamic content.',
  },
  {
    icon: Icons.ri_base_station_line,
    title: 'Intelligent Routing',
    description:
      'Direct queries to the right agent or department based on conversation context.',
  },
  {
    icon: Icons.ri_magic_line,
    title: 'Customizable Workflows',
    description:
      'Design complex scenarios with conditional logic for diverse user intents.',
  },
  {
    icon: Icons.ri_stack_fill,
    title: 'Data Collection & Forms',
    description:
      'Gather essential user information directly within the chat interface.',
  },
];

const CoreCapabilities = () => {
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
