import React, { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import ReusableDialog from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/ReusableDialog';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';
import AddOrEditAgentForm from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddOrEditAgentForm';
const InviteAgents = () => {
  const [open, setOpen] = useState(false);

  return (
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
          <Button
            className="h-full max-h-[36px] w-auto rounded px-[22px] py-2.5 text-xs leading-4 font-semibold"
            onClick={() => setOpen(true)}
          >
            <Icons.plus />
            Add agent in your workspace
          </Button>
          {/* add agennt button */}
          <AgentInviteModal
            open={open}
            onOpenChange={setOpen}
            dialogTitle="Add Agent"
            dialogDescription="Invite a new agent to join your workspace."
            dialogClass="!max-w-[768px]"
          >
            <AddOrEditAgentForm />
          </AgentInviteModal>
        </div>
      </div>
    </section>
  );
};

export default InviteAgents;
