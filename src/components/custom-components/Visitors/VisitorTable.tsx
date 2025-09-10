'use client';

import React, { useMemo, useState, useEffect } from 'react';
import DataTable from '@/components/common/table/table';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';
import VisitorDetailModal from '@/components/custom-components/Visitors/VisitorDetailModal';
import profile from '@/assets/images/MenProfile.svg';
import FilterComponent from './FilterComponent';
import DeleteModal from '@/components/modal/DeleteModal';

import { parseISO, format } from 'date-fns';
import { VisitorsService } from '@/services/visitors/visitors';

type VisitorData = {
  id: number;
  visitor: string;
  status?: string;
  lastActive: string;
  activeDuration: string;
  numOfVisits: number;
  engaged: string;
  ipAddress: string;
};

const VisitorTable = () => {
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorData | null>(
    null,
  );
  const [visitorDetails, setVisitorDetails] = useState<any>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterPosition, setFilterPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetVisitor, setDeleteTargetVisitor] =
    useState<VisitorData | null>(null);

  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('');

  const statuses = [
    'Active',
    'Inactive',
    'Guest',
    'Engaged',
    'Registered Recently',
  ];
  const sortOptions = [
    'Oldest First',
    'Newest First',
    'A-Z (Name)',
    'Z-A (Name)',
    'Most Engaged',
  ];

  const statusMap: Record<string, string> = {
    Active: 'Active',
    Inactive: 'Inactive',
    Guest: 'Guest',
    Engaged: 'Engaged',
    'Registered Recently': 'recently_registered',
  };

  const sortMap: Record<string, string> = {
    'Oldest First': 'Oldest',
    'Newest First': 'Newest',
    'A-Z (Name)': 'A-Z',
    'Z-A (Name)': 'Z-A',
    'Most Engaged': 'most_engaged',
  };

  const fetchVisitorsData = async () => {
    try {
      const mappedStatuses = statusFilters.map((status) => statusMap[status]);
      const data = await VisitorsService.getVisitors({
        statusFilters: mappedStatuses,
        sortBy: sortMap[sortOption] || '',
      });

      if (!data?.data?.visitors) return;

      const visitorsData = data.data.visitors.map((v: any) => ({
        id: v.id,
        visitor: v.visitor_name,
        status: v.status,
        lastActive: v.last_active,
        activeDuration: v.active_duration,
        numOfVisits: v.num_of_visits,
        engaged: v.engagged,
        ipAddress: v.ip_address,
      }));

      setVisitors(visitorsData);
    } catch (err) {
      console.error('Error fetching visitors:', err);
    }
  };

  useEffect(() => {
    fetchVisitorsData();
  }, [statusFilters, sortOption]);

  const handleFilterClick = (e: React.MouseEvent) => {
    const icon = e.currentTarget as HTMLElement;
    const rect = icon.getBoundingClientRect();
    setFilterPosition({
      top: rect.bottom + window.scrollY + 12,
      left: rect.left + window.scrollX + 12,
    });
    setIsFilterOpen((prev) => !prev);
  };

  const handleViewDetails = async (
    visitor: VisitorData,
    event: React.MouseEvent,
  ) => {
    const eyeIcon = event.currentTarget as HTMLElement;
    const rect = eyeIcon.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 330,
    });
    setSelectedVisitor(visitor);

    try {
      const details = await VisitorsService.getVisitorsDetailsById(visitor.id);
      setVisitorDetails(details.data);
    } catch (err) {
      console.error('Error fetching visitor details:', err);
    }
  };

  const handleClose = () => {
    setSelectedVisitor(null);
    setModalPosition(null);
    setVisitorDetails(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetVisitor) return;
    try {
      await VisitorsService.deleteVisitors(deleteTargetVisitor.id);
      setVisitors((prev) =>
        prev.filter((v) => v.id !== deleteTargetVisitor.id),
      );
      setDeleteTargetVisitor(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting visitor:', err);
    }
  };

  const columns: ColumnDef<VisitorData>[] = useMemo(
    () => [
      { accessorKey: 'visitor', header: 'Visitor' },
      { accessorKey: 'status', header: 'Status' },
      {
        accessorKey: 'lastActive',
        header: 'Last Active',
        cell: ({ row }) => {
          const value = row.getValue('lastActive') as string;

          if (!value) return <span>-</span>;

          const formatted = format(parseISO(value), 'MMM d, yyyy');

          return (
            <span
              className={value === 'Currently Active' ? 'text-success' : ''}
            >
              {formatted}
            </span>
          );
        },
      },
      { accessorKey: 'activeDuration', header: 'Active Duration' },
      { accessorKey: 'numOfVisits', header: 'Num of Visits' },
      {
        accessorKey: 'engaged',
        header: 'Engaged',
        cell: ({ row }) => {
          const value = row.getValue('engaged') as string;
          return (
            <span
              className={
                value === 'YES' ? 'text-success' : 'text-alert-prominent'
              }
            >
              {value}
            </span>
          );
        },
      },
      {
        accessorKey: 'ipAddress',
        header: 'IP Address',
        cell: ({ row }) => {
          const ip = row.getValue('ipAddress') as string;
          const ipToCountryCode: Record<string, string> = {
            '192.147.761.255': 'NP',
          };
          const countryCode = ipToCountryCode[ip] || 'UN';
          const flagUrl = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
          return (
            <div className="flex items-center gap-2">
              <div className="border-border-grey/20 flex h-[24px] w-[24px] border p-[5px]">
                <Image
                  src={flagUrl}
                  alt={`${countryCode} flag`}
                  width={14}
                  height={10}
                  className="block"
                />
              </div>
              <span>{ip}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="text-theme-text-primary flex gap-3">
            <Icons.ri_chat_ai_fill
              className="text-brand-primary h-4 w-4 cursor-pointer"
              onClick={() => console.log(`Chat with ${row.original.visitor}`)}
            />
            <Icons.ri_eye_fill
              className="text-info h-4 w-4 cursor-pointer"
              onClick={(e) => handleViewDetails(row.original, e)}
            />
            <Icons.ri_indeterminate_circle_fill
              className="text-alert-prominent h-4 w-4 cursor-pointer"
              onClick={() => {
                setDeleteTargetVisitor(row.original);
                console.log(row.original);
                setIsDeleteModalOpen(true);
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <DataTable
        columns={columns}
        data={visitors}
        onFilterClick={handleFilterClick}
        showFilterIcon
        showSearch
      />

      {isDeleteModalOpen && deleteTargetVisitor && (
        <DeleteModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="Delete Visitor"
          description={`Are you sure you want to delete ${deleteTargetVisitor.visitor}? This action cannot be undone.`}
          icon={<Icons.ri_delete_bin_7_fill className="text-alert-prominent" />}
          iconBgColor="bg-error-light"
          cancelText="Cancel"
          confirmText="Delete Visitor"
          cancelVariant="outline_gray"
          confirmVariant="destructive"
          cancelSize="sm"
          confirmSize="sm"
          onCancel={() => setDeleteTargetVisitor(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {isFilterOpen && filterPosition && (
        <div
          style={{
            position: 'absolute',
            top: filterPosition.top,
            left: filterPosition.left,
            zIndex: 1000,
          }}
        >
          <FilterComponent
            statusOptions={statuses}
            sortOptions={sortOptions}
            statusLabel="Filter By Status"
            sortLabel="Filter By"
            onStatusChange={setStatusFilters}
            onSortChange={setSortOption}
            statusFilters={statusFilters}
            sortOption={sortOption}
            getSortIcon={(option, isSelected) => {
              if (option === 'A-Z (Name)' || option === 'Z-A (Name)') {
                return isSelected ? (
                  <Icons.chevron_up className="h-2 w-2" />
                ) : (
                  <Icons.chevron_down className="h-2 w-2" />
                );
              }
              return null;
            }}
          />
        </div>
      )}

      {selectedVisitor && modalPosition && visitorDetails && (
        <VisitorDetailModal
          name={selectedVisitor.visitor}
          image={visitorDetails.picture || profile.src}
          details={[
            { label: 'Email Address', value: visitorDetails.email },
            {
              label: 'Location',
              value: visitorDetails.location,
              icon: (
                <Icons.ri_map_pin_line className="text-theme-text-primary h-4 w-4" />
              ),
            },
            { label: 'Engaged', value: visitorDetails.engagged },
            {
              label: 'IP Address',
              value: visitorDetails.ip_address,
              icon: (
                <Icons.ri_apple_line className="text-theme-text-primary h-4 w-4" />
              ),
            },
            {
              label: 'Browser',
              value: visitorDetails.browser,
              icon: (
                <Icons.ri_window_line className="text-theme-text-primary h-4 w-4" />
              ),
            },
            {
              label: 'Log in time',
              value: new Date(visitorDetails.login_time).toLocaleTimeString(
                [],
                { hour: '2-digit', minute: '2-digit', hour12: true },
              ),
              icon: (
                <Icons.ri_login_box_line className="text-theme-text-primary h-4 w-4" />
              ),
            },
          ]}
          activity={visitorDetails.activities.map((act: any) => ({
            label: act.action_type,
            subLabel: act.details,
            timestamp: new Date(act.activity_at).toLocaleString(),
          }))}
          onClose={handleClose}
          onStartChat={() =>
            console.log(`Start chat with ${selectedVisitor.visitor}`)
          }
          style={{
            position: 'absolute',
            top: modalPosition.top,
            left: modalPosition.left,
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
};

export default VisitorTable;
