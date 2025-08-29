'use client';

import React, { useState, useMemo } from 'react';
import { Icons } from '@/components/ui/Icons';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/common/table/table';
import { PlanDataFeature } from './types';

const sectionData: Record<string, PlanDataFeature[]> = {
  'Pricing and Core Limits': [
    {
      overview: 'Cloud-Based',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Mobile & Desktop App',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Real-Time Notification',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Developer APIs',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Live Geo Location',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Conversation Transcript',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Working Hours',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Unlimited Conversations',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Custom Email Domain',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Full Conversation History',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'File Sharing',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'canned Responses',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Conversation Ratings',
      starter: false,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Follow Up Reminders',
      starter: false,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Round Robin Routing',
      starter: false,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Customer Portal',
      starter: false,
      business: true,
      enterprise: true,
    },
  ],
  'Team Inbox & Collaboration': [
    {
      overview: 'Cloud-Based',
      starter: false,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Live Geo Location',
      starter: true,
      business: true,
      enterprise: true,
    },
    {
      overview: 'Conversation Transcript',
      starter: false,
      business: false,
      enterprise: true,
    },
  ],
};

const renderIcon = (value: boolean) =>
  value ? (
    <Icons.checbox_circle className="text-success h-6 w-6" />
  ) : (
    <Icons.ri_close_circle_fill className="text-alert-prominent h-6 w-6" />
  );

const columns: ColumnDef<PlanDataFeature>[] = [
  {
    accessorKey: 'overview',
    header: () => <span className="text-[16px] font-semibold">Overview</span>,
    cell: ({ row }) => (
      <span className="text-[15px] font-medium">{row.original.overview}</span>
    ),
  },
  {
    accessorKey: 'starter',
    header: () => <span className="text-[16px] font-semibold">Starter</span>,
    cell: ({ row }) => renderIcon(row.original.starter),
  },
  {
    accessorKey: 'business',
    header: () => <span className="text-[16px] font-semibold">Business</span>,
    cell: ({ row }) => renderIcon(row.original.business),
  },
  {
    accessorKey: 'enterprise',
    header: () => <span className="text-[16px] font-semibold">Enterprise</span>,
    cell: ({ row }) => renderIcon(row.original.enterprise),
  },
];

const sectionTitles = [
  'Pricing and Core Limits',
  'Team Inbox & Collaboration',
  'Channels Supported',
  'Integration Apps',
  'Chat Widgets Features',
  'AI Feature',
  'CRM Features',
  'Workflow Automation',
  'Help Center',
  'Analytics',
  'Status Page Features',
  'Data Security',
];

const PricingAndFeatures = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const data = useMemo(() => {
    if (activeSection && sectionData[activeSection]) {
      return sectionData[activeSection];
    }
    return [];
  }, [activeSection]);

  const toggleSection = (title: string) => {
    setActiveSection((prev) => (prev === title ? null : title));
  };

  return (
    <div className="flex flex-col gap-3">
      {sectionTitles.map((title) => (
        <div key={title}>
          <div
            onClick={() => toggleSection(title)}
            className="text-theme-text-primary border-grey-light flex cursor-pointer items-center justify-between rounded-[4px] border px-4 py-2 text-sm leading-5"
          >
            <span>{title}</span>
            {activeSection === title ? (
              <Icons.chevron_up className="h-4 w-4" />
            ) : (
              <Icons.chevron_down className="h-4 w-4" />
            )}
          </div>

          {activeSection === title && (
            <div className="mt-4">
              <DataTable
                columns={columns}
                data={data}
                showSearch={false}
                showFilterIcon={false}
                headerHeight="48px"
                headerClassName="text-black text-[16px] font-semibold bg-secondary-hover leading-6.5"
                rowClassName="text-theme-text-primary font-medium pl-2 text-[15px] leading-[26px]"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PricingAndFeatures;
