import React, { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterComponentProps {
  statusOptions: string[];
  sortOptions: string[];
  onStatusChange?: (filters: string[]) => void;
  onSortChange?: (option: string) => void;
  statusLabel: string;
  sortLabel: string;
  className?: string;
  getSortIcon?: (option: string, isSelected: boolean) => React.ReactNode;
  hideFilter?: string; //added by rahul
  showDivider?: string; //added by rahul
  statusFilters: string[];
  sortOption: string;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  statusOptions,
  sortOptions,
  onStatusChange,
  onSortChange,
  statusLabel,
  sortLabel,
  className,
  getSortIcon,
  statusFilters,
  sortOption,
  hideFilter,
  showDivider,
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(true);

  const toggleStatus = (status: string) => {
    const updated = statusFilters.includes(status)
      ? statusFilters.filter((s) => s !== status)
      : [...statusFilters, status];
    onStatusChange?.(updated);
  };

  const handleSortSelect = (option: string) => {
    const updated = sortOption === option ? '' : option;
    onSortChange?.(updated);
  };

  return (
    <div
      className={`flex w-fit gap-4 rounded-[8px] bg-white p-4 px-[36px] ${className}`}
      style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)' }}
    >
      <div className="w-[175px]">
        <div
          className="border-grey-light text-theme-text-primary mb-2 flex cursor-pointer items-center justify-between rounded-[4px] border p-[10px] text-xs leading-4 font-semibold"
          onClick={() => setIsStatusOpen((prev) => !prev)}
        >
          <span>{statusLabel}</span>
          {isStatusOpen ? (
            <Icons.chevron_up className="text-theme-text-primary h-4 w-4" />
          ) : (
            <Icons.chevron_down className="text-theme-text-primary h-4 w-4" />
          )}
        </div>
        {isStatusOpen && (
          <div className="border-grey-light space-y-3 rounded border p-3">
            {statusOptions.map((status) => (
              <label
                key={status}
                className="flex cursor-pointer items-center gap-4 text-xs"
              >
                <Checkbox
                  checked={statusFilters.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                  className="border-grey-light data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary h-5.5 w-5 shadow-inner data-[state=checked]:text-white"
                />
                {status}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={`bg-brand-light h-12 w-[1px] ${showDivider}`} />
      <div className={`w-[178px] ${hideFilter}`}>
        <div
          className="border-grey-light text-theme-text-primary mb-2 flex cursor-pointer items-center justify-between rounded border px-3 py-2 text-xs font-semibold"
          onClick={() => setIsSortOpen((prev) => !prev)}
        >
          <span>{sortLabel}</span>
          {isSortOpen ? (
            <Icons.chevron_up className="text-theme-text-primary h-4 w-4" />
          ) : (
            <Icons.chevron_down className="text-theme-text-primary h-4 w-4" />
          )}
          \
        </div>
        {isSortOpen && (
          <div className="border-grey-light space-y-3 rounded border p-3">
            {sortOptions?.map((option) => {
              const isSelected = sortOption === option;
              return (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 text-xs leading-4"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSortSelect(option)}
                    className="border-grey-light data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary h-5.5 w-5 shadow-inner data-[state=checked]:text-white"
                  />
                  <span className="flex items-center gap-1">
                    {option}
                    {getSortIcon?.(option, isSelected)}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterComponent;
