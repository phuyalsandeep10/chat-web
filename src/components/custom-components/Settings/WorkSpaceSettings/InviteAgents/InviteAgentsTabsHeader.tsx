import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@/components/ui/Icons';
import OperatorsTable from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/OperatorsTable';
import TeamTable from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/TeamTable';
import RolesTable from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Roles/RolesTable';
import { AlertDialogDemoRef } from '@/components/modal/AlertModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InviteTable from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Invites/InviteTable';
import FilterComponent from '@/components/custom-components/Visitors/FilterComponent';

// Define the modalProps type
type ModalProps = {
  heading: string;
  subheading: string;
  onAction: () => void;
  headericon?: ReactNode; // Use ReactNode for components, strings, etc.
};

const InviteAgentsTabsHeader = () => {
  // dynamically pass props to alert dialog
  const [modalProps, setModalProps] = useState<ModalProps>({
    heading: '',
    subheading: '',
    onAction: () => {},
    headericon: <Icons.ri_delete_bin_7_fill />,
  });

  // trigger open close through ref
  const alertRef = useRef<AlertDialogDemoRef>(null);

  // toggle alert modal
  const handleOpenDialog = (props: ModalProps) => {
    setModalProps({
      heading: props.heading,
      subheading: props.subheading,
      onAction: () => {
        props.onAction();
        alertRef.current?.close();
      },
      headericon: props.headericon || <Icons.ri_delete_bin_7_fill />,
    });
    alertRef.current?.open();
  };

  // to know which table is active
  const [activeTable, setActiveTable] = useState('Invites');

  // toggle filter option
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterPosition, setFilterPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const filterIconRef = useRef<HTMLDivElement | null>(null);

  // adjust position of  filter
  // Called when user clicks the filter icon
  const handleFilterClick = () => {
    if (filterIconRef.current) {
      const rect = filterIconRef.current.getBoundingClientRect();
      setFilterPosition({
        top: rect.height + 8,
        left:
          activeTable === 'Operators' || activeTable === 'Invites'
            ? -435
            : -222,
      });
      setIsFilterOpen((prev) => !prev);
    }
  };

  // Called when active table changes — keep filter correctly positioned
  useEffect(() => {
    if (isFilterOpen && filterIconRef.current) {
      const rect = filterIconRef.current.getBoundingClientRect();
      setFilterPosition({
        top: rect.height + 8,
        left:
          activeTable === 'Operators' || activeTable === 'Invites'
            ? -435
            : -222,
      });
    }
  }, [activeTable]);

  // close filter when clicked outside of the filter container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        filterIconRef.current &&
        !filterIconRef.current.contains(target) &&
        !document.getElementById('filter-popup')?.contains(target)
      ) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // label for filter
  // operation table filter shifts
  const statuses = ['Morning', 'Day', 'Night'];

  // Invites table filter shifts
  const inviteStatuses = ['Sent', 'Rejected'];

  // Roles table filter shifts
  const RoleStatuses = ['Admin', 'Agent', 'Moderator'];

  const sortOptions = ['Admin', 'Agent'];

  return (
    <>
      {/* buttons to navigate to different pages */}

      <div>
        <Tabs
          defaultValue="Invites"
          value={activeTable}
          onValueChange={setActiveTable}
          className="w-full gap-[12px]"
        >
          <div className="flex justify-between border-b">
            <TabsList className="border-grey-light flex gap-[35px] bg-transparent p-0 pb-1">
              <TabsTrigger
                value="Invites"
                className="text-muted-foreground data-[state=active]:text-brand-primary relative border-0 text-xs leading-[17px] font-normal !shadow-none data-[state=active]:before:absolute data-[state=active]:before:-bottom-[5px] data-[state=active]:before:w-[61px] data-[state=active]:before:border-b-[1px] data-[state=active]:before:pb-3 data-[state=active]:before:content-['']"
              >
                Invites
              </TabsTrigger>
              <TabsTrigger
                value="Operators"
                className="text-muted-foreground data-[state=active]:text-brand-primary relative text-xs leading-[17px] font-normal !shadow-none data-[state=active]:before:absolute data-[state=active]:before:-bottom-[5px] data-[state=active]:before:w-[82px] data-[state=active]:before:border-b-[1px] data-[state=active]:before:pb-3 data-[state=active]:before:content-['']"
              >
                Operators
              </TabsTrigger>
              <TabsTrigger
                value="Teams"
                className="text-muted-foreground data-[state=active]:text-brand-primary relative text-xs leading-[17px] font-normal !shadow-none data-[state=active]:before:absolute data-[state=active]:before:-bottom-[5px] data-[state=active]:before:w-[82px] data-[state=active]:before:border-b-[1px] data-[state=active]:before:pb-3 data-[state=active]:before:content-['']"
              >
                Teams
              </TabsTrigger>
              <TabsTrigger
                value="Roles"
                className="text-muted-foreground data-[state=active]:text-brand-primary relative text-xs leading-[17px] font-normal !shadow-none data-[state=active]:before:absolute data-[state=active]:before:-bottom-[5px] data-[state=active]:before:w-[82px] data-[state=active]:before:border-b-[1px] data-[state=active]:before:pb-3 data-[state=active]:before:content-['']"
              >
                Roles
              </TabsTrigger>
            </TabsList>
            <div className="relative">
              <div
                id="filter-popup"
                className="text-brand-primary"
                ref={filterIconRef}
                onClick={handleFilterClick}
              >
                <Icons.filter />
              </div>

              {/* toggle filter components according to table */}
              {isFilterOpen &&
                filterPosition &&
                (() => {
                  const filterConfig: Record<string, any> = {
                    Operators: {
                      statusOptions: statuses,
                      statusLabel: 'Filter By Shift',
                      sortLabel: 'Filter By Roles',
                    },
                    Invites: {
                      statusOptions: inviteStatuses,
                      statusLabel: 'Filter By Status',
                      sortLabel: 'Filter By Roles',
                    },
                    Teams: {
                      statusOptions: inviteStatuses,
                      statusLabel: 'Filter By Status',
                      sortLabel: 'Filter By Roles',
                      hideFilter: 'hidden',
                      showDivider: 'hidden',
                    },
                    Roles: {
                      statusOptions: RoleStatuses,
                      statusLabel: 'Filter By Role Name',
                      hideFilter: 'hidden',
                      showDivider: 'hidden',
                    },
                  };

                  const config = filterConfig[activeTable];
                  if (!config) return null;

                  return (
                    <div
                      className="absolute z-[1000]"
                      style={{
                        top: filterPosition.top,
                        left: filterPosition.left,
                      }}
                    >
                      <FilterComponent
                        {...config}
                        sortOptions={sortOptions}
                        onStatusChange={() => {}}
                        onSortChange={() => {}}
                      />
                    </div>
                  );
                })()}
            </div>
          </div>

          <TabsContent value="Invites">
            <InviteTable handleOpenDialog={handleOpenDialog} />
          </TabsContent>
          <TabsContent value="Operators">
            <OperatorsTable handleOpenDialog={handleOpenDialog} />
          </TabsContent>
          <TabsContent value="Teams">
            {' '}
            <TeamTable handleOpenDialog={handleOpenDialog} />
          </TabsContent>
          <TabsContent value="Roles">
            <RolesTable handleOpenDialog={handleOpenDialog} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default InviteAgentsTabsHeader;
