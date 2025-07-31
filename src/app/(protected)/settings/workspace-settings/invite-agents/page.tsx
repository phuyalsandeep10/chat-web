'use client';

import React, { useState, useRef } from 'react';
import { Icons } from '@/components/ui/Icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Settings from '@/components/custom-components/Settings/Settings';
import OperatorsTable from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/OperatorsTable';
import TeamTable from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/TeamTable';
import RolesTable from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Roles/RolesTable';
import {
  AlertDialogDemo,
  AlertDialogDemoRef,
} from '@/components/modal/AlertModal';
import { AgenChatHistoryCard } from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgenChatHistoryCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InviteAgents = () => {
  // dynamically pass props to alert dialog
  const [modalProps, setModalProps] = useState({
    heading: '',
    subheading: '',
    onAction: () => {},
    headericon: <Icons.ri_delete_bin_7_fill />,
  });

  // trigger open close through ref
  const alertRef = useRef<AlertDialogDemoRef>(null);

  // toggle alert modal
  const handleOpenDialog = (props: {
    heading: string;
    subheading: string;
    onAction: () => void;
    headericon?: React.ReactNode;
  }) => {
    setModalProps({
      heading: props.heading,
      subheading: props.subheading,
      onAction: () => {
        props.onAction();
        alertRef.current?.close(); // Close modal after action
      },
      headericon: props.headericon || <Icons.ri_delete_bin_7_fill />,
    });
    alertRef.current?.open();
  };

  return (
    <Settings>
      <section className="font-outfit">
        <div>
          {/* title of invite agents  */}
          <div className="flex items-end gap-2 pb-20">
            <h2 className="text-brand-dark text-[32px] leading-10 font-semibold">
              Invite Agents
            </h2>
            <Icons.help className="text-brand-dark" />
          </div>
          {/* notification bar of invite agents */}
          <div className="bg-info-light mb-20 flex gap-3 rounded-lg px-3 py-[9px]">
            <Icons.info className="text-info" />
            <p className="text-info text-base leading-[26px] font-normal">
              Want to control access? Add roles and assign permissions so team
              members only see what they need. Head to{' '}
              <strong className="font-semibold underline">
                Create Permission
              </strong>{' '}
              to begin.
            </p>
          </div>
          {/* invite agents container */}
          <div className="pb-5">
            <h4 className="pb-1 text-xl leading-[30px] font-semibold">
              Invite agents to your workspace.
            </h4>
            <p className="text-base leading-[26px] font-normal">
              Send invites, assign roles, and launch your support team.
            </p>
          </div>

          {/*invite agents input field */}
          <div className="mb-[86px] flex gap-5">
            <Input
              placeholder="Invite your agents"
              className="text-pure-black placeholder:text-pure-black border-grey-light h-[36px] rounded-sm border-[1px]"
            />

            <Button className="h-full max-h-[36px] w-auto rounded px-[22px] py-2.5 text-xs leading-4 font-semibold">
              {' '}
              <Icons.plus />
              Add agent in your workspace
            </Button>
          </div>

          {/* buttons to navigate to different pages */}

          <div>
            <Tabs defaultValue="Operators" className="w-full gap-[12px]">
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
                <div className="text-brand-primary w-">
                  <Icons.filter />
                </div>
              </div>

              <TabsContent value="Invites" />
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

          {/* table of operators */}

          {/* delete card */}

          <AlertDialogDemo
            ref={alertRef}
            headericon={modalProps.headericon}
            heading={modalProps.heading}
            subheading={modalProps.subheading}
            cancelText="Cancel"
            actionText="Confirm &Delete"
            onCancel={() => alertRef.current?.close()}
            onAction={modalProps.onAction}
            cancelClassName="bg-transparent text-disabled-foreground border-[1px] border-gray-primary"
            actionClassName="bg-red-600 text-white"
            modalClassName="flex items-center justify-center flex-col"
            DialogHeaderClassName="text-center text-base leading-[26px] font-medium"
            descriptionClassName="text-center text-xs font-normal leading-[17px] text-alert-prominent"
            headerIconClass="flex justify-center "
            iconClass="h-[52px] w-[52px] rounded-[26px] bg-error-light flex items-center justify-center text-alert-prominent "
          />

          {/* add card */}
          {/* 
          <AgenChatHistoryCard
            headerIconClass="bg-black w-[36px] h-[36px] text-center rounded-[50px] px-3 py-3 flex items-center justify-center"
            iconClass="text-white "
            headericon={<Icons.ri_user_fill />}
            ConviconClass="bg-black"
          /> */}
        </div>
      </section>
    </Settings>
  );
};

export default InviteAgents;
