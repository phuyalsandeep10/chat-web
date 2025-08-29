'use client';
import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/common/table/table';
import { PlanComparisonData } from './types';

const columns: ColumnDef<PlanComparisonData>[] = [
  {
    accessorKey: 'overview',
    header: 'Overview',
  },
  {
    accessorKey: 'starter',
    header: 'Starter',
  },
  {
    accessorKey: 'business',
    header: 'Business',
  },
  {
    accessorKey: 'enterprise',
    header: 'Enterprise',
  },
];

const rawData: PlanComparisonData[] = [
  {
    overview: 'User Limit',
    starter: '10',
    business: 'Unlimited',
    enterprise: 'Unlimited',
  },
  {
    overview: 'Free 1 local number ( Only for US or Canada)',
    starter: 'Per User',
    business: 'Per User',
    enterprise: 'Per User',
  },
  {
    overview: 'Calling',
    starter: 'Pay Per Minute Calling',
    business: 'Pay Per Minute Calling',
    enterprise: 'Pay Per Minute Calling',
  },
  {
    overview: 'SMS',
    starter: 'Pay Per Segement',
    business: 'Pay Per Segement',
    enterprise: 'Pay Per Segement',
  },
  {
    overview: 'MMS',
    starter: 'Pay Per MMS',
    business: 'Pay Per MMS',
    enterprise: 'Pay Per MMS',
  },
  {
    overview: 'Call Recordings And Storage',
    starter: 'Pay as you go',
    business: 'Pay as you go',
    enterprise: 'Pay as you go',
  },
  {
    overview: 'Realtime Dashboard',
    starter: 'Basic',
    business: 'Comprehensive',
    enterprise: 'Comprehensive',
  },
  {
    overview: 'Screen time details',
    starter: 'Basic',
    business: 'Comprehensive',
    enterprise: 'Comprehensive',
  },
];

const PlanComparisonTable = () => {
  const data = useMemo(() => rawData, []);

  return (
    <div>
      <p className="text-brand-dark mb-8 text-xl leading-7.5 font-semibold">
        Plan Comparison: Starter vs Business vs Enterprise
      </p>
      <DataTable
        columns={columns}
        data={data}
        showSearch={false}
        showFilterIcon={false}
        headerHeight="48px"
        headerClassName="text-black text-[24px] font-semibold bg-secondary-hover leading-6.5"
        rowClassName="text-theme-text-primary font-medium pl-2 text-[16px] leading-6.5"
      />
    </div>
  );
};

export default PlanComparisonTable;
