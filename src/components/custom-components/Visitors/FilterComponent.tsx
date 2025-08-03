import React, { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import { Checkbox } from '@/components/ui/checkbox';

type FilterComponentProps = {
  statusOptions: string[];
  sortOptions?: string[];
  onStatusChange?: (selectedStatuses: string[]) => void;
  onSortChange?: (selectedSort: string) => void;
  statusLabel?: string;
  sortLabel?: string;
  className?: string;
  getSortIcon?: (option: string, isSelected: boolean) => React.ReactNode;
  hideFilter?: string; //added by rahul
  showDivider?: string; //added by rahul
};

const FilterComponent: React.FC<FilterComponentProps> = ({
  statusOptions,
  sortOptions,
  onStatusChange,
  onSortChange,
  statusLabel,
  sortLabel,
  className,
  getSortIcon,
  hideFilter,
  showDivider,
}) => {
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('');
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(true);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(true);

  const toggleStatus = (status: string) => {
    setStatusFilters((prev) => {
      const updated = prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status];
      onStatusChange?.(updated);
      return updated;
    });
  };

  const handleSortSelect = (option: string) => {
    const updated = sortOption === option ? '' : option;
    setSortOption(updated);
    onSortChange?.(updated);
  };

  return (
    <div
      className={`flex w-fit gap-4 rounded-[8px] bg-white p-4 px-[36px] ${className}`}
      style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)' }}
    >
      <div className="w-[175px]">
        <div
          className="border-grey-light text-theme-text-primary mb-2 flex cursor-pointer items-center justify-between rounded-[4px] border p-[10px] text-[12px] leading-[16px] font-semibold"
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
                className="flex cursor-pointer items-center gap-[16px] text-[12px]"
              >
                <Checkbox
                  checked={statusFilters.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                  className="border-grey-light data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary h-[22px] w-[20px] shadow-inner data-[state=checked]:text-white"
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
          className="border-grey-light text-theme-text-primary mb-2 flex cursor-pointer items-center justify-between rounded border px-3 py-2 text-[12px] font-semibold"
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
                  className="flex cursor-pointer items-center gap-3 text-[12px] leading-[17px]"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSortSelect(option)}
                    className="border-grey-light data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary h-[22px] w-[20px] shadow-inner data-[state=checked]:text-white"
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
