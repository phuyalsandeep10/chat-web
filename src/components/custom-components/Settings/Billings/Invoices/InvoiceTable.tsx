'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import DataTable from '@/components/common/table/table';
import Image from 'next/image';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/ui/Icons';
import pdfIcon from '@/assets/images/pdfIcon.svg';
import profile from '@/assets/images/profile.jpg';
import { Invoice } from './types';

const data: Invoice[] = [
  {
    id: '1',
    invoiceNumber: '#007 - Dec 2025',
    billingAdmin: {
      name: 'Abinash Babu Tiwari',
      email: 'abinash@chatboq.com',
      profile: profile,
    },
    billingDate: 'December 2, 2025',
    amount: 'USD 120.34',
    numOfUsers: 10,
    status: 'paid',
  },
  {
    id: '2',
    invoiceNumber: '#008 - Dec 2025',
    billingAdmin: {
      name: 'Rinchhen Thing',
      email: 'rincheen@chatboq.com',
      profile: profile,
    },
    billingDate: 'December 6, 2025',
    amount: 'USD 120.34',
    numOfUsers: 10,
    status: 'paid',
  },
  {
    id: '3',
    invoiceNumber: '#008 - Dec 2025',
    billingAdmin: {
      name: 'Pankaj Gurung',
      email: 'pankaj@chatboq.com',
      profile: profile,
    },
    billingDate: 'December 6, 2025',
    amount: 'USD 120.34',
    numOfUsers: 10,
    status: 'paid',
  },
];

const columns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className="custom-checkbox"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="custom-checkbox"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'invoiceNumber',
    header: 'Invoice',
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-default items-center gap-2">
            <Image src={pdfIcon} alt="pdf-icon" className="h-4 w-4" />
            <span>{`Invoice ${row.original.invoiceNumber}`}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={4}>
          <p>Paid Invoice</p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: 'billingAdmin',
    header: 'Billing Admin',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.original.billingAdmin.profile}
          alt={row.original.billingAdmin.name}
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span>{row.original.billingAdmin.name}</span>
          <span>{row.original.billingAdmin.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'billingDate',
    header: 'Billing date',
    cell: ({ row }) => <span>{row.original.billingDate}</span>,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <span>{row.original.amount}</span>,
  },
  {
    accessorKey: 'numOfUsers',
    header: 'No. of Users',
    cell: ({ row }) => <span>{row.original.numOfUsers}</span>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <div className="flex items-center gap-3">
        <Icons.ri_download_cloud_2_line className="h-4.5 w-4.5 cursor-pointer" />
        <Icons.ri_eye_line className="h-4.5 w-4.5 cursor-pointer" />
      </div>
    ),
  },
];

const InvoiceTable = () => {
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={data}
        showSearch={false}
        showFilterIcon={false}
        headerHeight="48px"
        headerClassName="bg-white text-black text-[16px] font-medium"
        rowClassName="text-brand-dark text-sm font-normal"
        underlineHeader={true}
      />
    </div>
  );
};

export default InvoiceTable;
