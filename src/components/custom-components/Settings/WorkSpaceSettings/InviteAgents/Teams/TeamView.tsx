import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/Icons';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DialogClose } from '@/components/ui/dialog';
import Image from 'next/image';
import TeamProfile from '@/assets/images/team_profile.svg';
// import AddAgentDialog from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AddAgentDialog';
import TeamMemberInfo from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/Teams/TeamMemberInfo';
import AgentInviteModal from '@/components/custom-components/Settings/WorkSpaceSettings/InviteAgents/AgentInviteModal';

// Define a type for each team member
type TeamMember = {
  member_id: number;
  username: string;
  // add other fields if they exist in your data
};

// Define the structure of the API response
type TeamMembersResponse = {
  data: TeamMember[];
  // add other response fields if they exist
};

// interface TeamViewProps {
//   teamId: number;
//   data?: {
//     data: TeamMember[];
//   };
// }

interface TeamViewProps {
  teamId: number;
  data?: TeamMembersResponse; // use the same type from the API
}

const TeamView: React.FC<TeamViewProps> = ({ teamId, data }) => {
  const [openTeamInfo, setOpenTeamInfo] = useState(false);

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const handleViewMember = (memberId: number) => {
    setSelectedMemberId(memberId);
    setOpenTeamInfo(true);
  };

  console.log(data, 'data in team view');
  return (
    <Card className="w-full max-w-full border-0 p-0 px-5 shadow-none">
      <CardHeader className="inline-flex items-center gap-x-[17px] gap-y-[14px] p-0">
        <CardTitle className="text-lg leading-[29px] font-semibold">
          Team Members
        </CardTitle>
      </CardHeader>

      {data?.data?.map((temviewItems: TeamMember, temViewIndex: number) => {
        return (
          <CardContent
            key={temViewIndex}
            className="border-gray-light rounded-[4px] border-2 px-5.5 py-[7px] shadow-[0_0_4px_1px_#15F64540]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[18px]">
                {/* Team image */}
                <div className="border-brand-primary rounded-full border p-[6px]">
                  <Image
                    src={TeamProfile}
                    alt="team-profile"
                    width={48}
                    height={48}
                  />
                </div>

                {/* Team content */}
                <div className="text-base leading-[26px]">
                  <p className="text-brand-dark font-medium">
                    {temviewItems.username}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-success inline-block h-2 w-2 rounded-full" />
                    <span className="text-success">Active</span>
                  </div>
                </div>
              </div>

              {/* view team info */}
              <div>
                <div
                  className="h-full max-h-[36px] w-auto rounded text-xs leading-4 font-semibold"
                  onClick={() => {
                    setOpenTeamInfo(true);
                    handleViewMember(temviewItems.member_id);
                  }}
                >
                  <Icons.info className="text-brand-primary" />
                  {/* <Icons.ri_edit2_fill /> */}
                </div>
                <AgentInviteModal
                  open={openTeamInfo}
                  onOpenChange={setOpenTeamInfo}
                >
                  <TeamMemberInfo
                    memberInfo={data}
                    memberId={selectedMemberId}
                  />
                </AgentInviteModal>
              </div>
            </div>
          </CardContent>
        );
      })}

      <CardFooter className="mt-4 flex justify-center gap-4">
        <DialogClose asChild>
          <Button
            className="text-brand-primary h-[36px] w-full max-w-[130px] rounded-lg px-4 py-2.5 text-xs leading-4 font-semibold"
            variant="outline"
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          className="bg-brand-primary h-[36px] w-full max-w-[130px] rounded-lg px-4 py-2.5 text-xs leading-4 font-semibold text-white"
          type="button"
        >
          Edit Team
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamView;
