import { Icons } from '@/components/ui/Icons';
import React from 'react';

const permissions = [
  'Read & Write Session',
  'Read & Write Session',
  'Read & Write Session',
  'Read & Write Session',
  'Read & Write Session',
  'Read & Write Session',
];

const developerInfo = [
  { label: 'Developer', value: 'Innovative Solution Inc.' },
  { label: 'Website', value: 'Innovative Solution Inc.' },
  { label: 'Support', value: 'Support@innovativesolution.com' },
  { label: 'Terms of Use', value: 'View Terms' },
  { label: 'Privacy Policy', value: 'View Policy' },
];

const RequiredPermissions = () => {
  return (
    <div className="border-gray-light w-[387px] flex-1 rounded-lg border pt-5 pr-11.5 pb-5 pl-5">
      <div className="mb-5">
        <h1 className="text-brand-dark mb-1 text-xl leading-7.5 font-semibold">
          Required Permissions
        </h1>
        <p className="text-sm font-normal">
          Smart flow AI assistant requires the following permission to function
          effectively.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4">
        {permissions.map((text, index) => (
          <div key={index} className="flex items-center gap-1">
            <Icons.check className="text-success h-3.5 w-3.5" />
            <p className="text-sm font-normal">{text}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-brand-dark mb-4 text-xl font-semibold">
          Required Permissions
        </p>
        <div className="flex flex-col gap-2">
          {developerInfo.map((item, index) => (
            <p key={index} className="text-sm font-normal">
              {item.label}: {item.value}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequiredPermissions;
