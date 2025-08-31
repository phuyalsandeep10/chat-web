// components/GenericTable.tsx
'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import React from 'react';
import { GenericTableProps } from './types';

export function ReuseableTable<T extends Record<string, any>>({
  columns,
  data,
  tableClassName = '',
  headerClassName = '',
}: GenericTableProps<T>) {
  return (
    <Table>
      <TableHeader
        className={cn('bg-light-blue mb-[11px] p-0', tableClassName)}
      >
        <TableRow>
          {columns.map((col, colIndex) => (
            <TableHead
              key={col.key}
              className={cn(
                'text-sm leading-[21px] font-semibold',
                col.headerClassName,
                headerClassName,
              )}
            >
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={(row as any).id ?? rowIndex} className="border-none">
            {columns.map((col, colIndex) => (
              <TableCell
                key={`${col.key}-${rowIndex}`}
                className={cn(
                  'text-xs leading-[17px] font-normal',
                  col.cellClassName,
                )}
              >
                {col.render
                  ? col.render(row)
                  : (row[col.key as keyof T] as React.ReactNode)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
