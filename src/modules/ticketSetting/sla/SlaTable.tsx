'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InputField } from '@/components/common/hook-form/InputField';
import { SelectField } from '@/components/common/hook-form/SelectField';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';
import DeleteModal from '@/components/modal/DeleteModal';
import { useSlaLogic } from './hooks/useSlaLogic';
import { useSlaAutoSaveHook } from './hooks/useSlaAutoSave';

interface SlaTableProps {
  slaList: any[];
}

export default function SlaTable({ slaList }: SlaTableProps) {
  const {
    control,
    newSlaControl,
    selectedRows,
    showNewRow,
    setIsDeleteOpen,
    isDeleteOpen,
    toggleRowSelection,
    handleCancel,
    handleAddNewRow,
    handleConfirmDelete,
    isAnySelected,
    priorityOptions,
    timeUnitOptions,
    capitalizeFirstLetter,
  } = useSlaLogic();

  const { control: autoSaveControl } = useSlaAutoSaveHook(slaList);

  return (
    <div>
      <div>
        <h1 className="font-outfit text-brand-dark text-xl font-semibold">
          SLA (Service Level Agreement)
        </h1>
        <div className="flex gap-20 text-justify">
          <p className="font-outfit text-brand-dark mt-1 text-xs font-normal">
            Define the maximum allowed time for the first reply (Response Time)
            and the time within which the issue must be completely resolved
            (Resolution Time). These times are crucial for maintaining service
            quality.
          </p>
          <Button
            type="button"
            onClick={handleAddNewRow}
            className="hover:bg-brand-primary/90 flex w-25 cursor-pointer items-center px-6 py-3 text-white"
          >
            <Icons.plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {isAnySelected && (
        <div className="mt-5 mb-3 flex items-center justify-between">
          <span className="font-outfit text-brand-primary text-base">
            {selectedRows.size} Selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
              <Icons.delete_bin_fill /> Delete
            </Button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Are you sure?"
        TitleclassName="font-outfit font-medium text-base text-black"
        description={`Deleting this ticket is a permanent action and cannot be undone. This may result in the loss of important information and context related to the issue.`}
        descriptionColor="text-alert-prominent font-outfit text-xs font-normal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        icon={''}
      />

      <div className="mt-5 overflow-hidden rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-light hover:bg-brand-light text-brand-dark h-15 text-lg font-semibold">
              <TableHead className="w-12"></TableHead>
              <TableHead>SLA Name</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Resolution Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {slaList?.map((sla: any) => {
              const isSelected = selectedRows.has(sla.id);
              const key = sla.priority?.name || `sla-${sla.id}`;
              return (
                <TableRow
                  key={sla.id}
                  className={
                    isSelected
                      ? 'bg-secondary-hover hover:bg-secondary-hover'
                      : ''
                  }
                >
                  <TableCell className="flex justify-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleRowSelection(sla.id)}
                      className={cn(
                        'mt-2 h-5 w-5 rounded border',
                        'data-[state=checked]:bg-brand-primary',
                        'data-[state=checked]:border-brand-primary',
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    {sla.name && (
                      <Badge className="font-outfit text-brand-dark bg-white text-sm font-normal">
                        {capitalizeFirstLetter(sla.name)}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    {sla.priority?.name && (
                      <Badge
                        className="font-outfit px-2 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: sla.priority.bg_color,
                          color: sla.priority.fg_color,
                          textTransform: 'capitalize',
                        }}
                      >
                        {sla.priority.name}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <InputField
                        control={autoSaveControl}
                        name={`${key}_responseTime`}
                        type="number"
                        className="h-9 w-28 text-sm"
                      />
                      <SelectField
                        control={autoSaveControl}
                        name={`${key}_responseUnit`}
                        options={timeUnitOptions}
                        className="h-9 w-28"
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <InputField
                        control={autoSaveControl}
                        name={`${key}_resolutionTime`}
                        type="number"
                        className="h-9 w-28 text-sm"
                      />
                      <SelectField
                        control={autoSaveControl}
                        name={`${key}_resolutionUnit`}
                        options={timeUnitOptions}
                        className="h-9 w-28"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* New SLA Row */}
            {showNewRow && (
              <TableRow className="bg-white">
                <TableCell className="flex justify-center">
                  <Checkbox disabled className="mt-2 h-5 w-5 rounded border" />
                </TableCell>

                <TableCell>
                  <InputField
                    control={newSlaControl}
                    name="new_sla_name"
                    placeholder="Enter SLA Name"
                    className="h-9 w-full text-sm"
                  />
                </TableCell>

                <TableCell>
                  <SelectField
                    control={newSlaControl}
                    name="new_sla_priority"
                    options={priorityOptions}
                    className="h-9 w-28 text-sm"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <InputField
                      control={newSlaControl}
                      name="new_sla_responseTime"
                      type="number"
                      className="h-9 w-28 text-sm"
                    />
                    <SelectField
                      control={newSlaControl}
                      name="new_sla_responseUnit"
                      options={timeUnitOptions}
                      className="h-9 w-28 text-sm"
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <InputField
                      control={newSlaControl}
                      name="new_sla_resolutionTime"
                      type="number"
                      className="h-9 w-28 text-sm"
                    />
                    <SelectField
                      control={newSlaControl}
                      name="new_sla_resolutionUnit"
                      options={timeUnitOptions}
                      className="h-9 w-28 text-sm"
                    />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
