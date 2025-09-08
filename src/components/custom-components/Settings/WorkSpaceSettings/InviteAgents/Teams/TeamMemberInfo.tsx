import React from 'react';
import Image from 'next/image';
import TeamProfile from '@/assets/images/team_profile.svg';
import { Icons } from '@/components/ui/Icons';
import { TeamMember, TeamMemberInfoProps } from './types';

const TeamMemberInfo: React.FC<TeamMemberInfoProps> = ({
  memberInfo,
  memberId,
}) => {
  // Find the selected member by memberId
  const member = memberInfo?.data?.find((m: any) => m.member_id === memberId);

  if (!member) return <p>Member not found</p>;

  return (
    <div className="flex flex-col items-center gap-[18px]">
      {/* Team image */}
      <div className="border-brand-primary rounded-full border p-[6px]">
        <Image
          src={TeamProfile}
          alt="team-profile"
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      </div>

      {/* Team content */}
      <div className="flex flex-col items-center text-base leading-[26px]">
        <p className="text-brand-dark font-medium">{member.username}</p>

        <div className="flex items-center gap-1.5 py-[7px]">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              member.is_active ? 'bg-success' : 'bg-gray-400'
            }`}
          ></span>
          <span
            className={`text-xs ${member.is_active ? 'text-success' : 'text-gray-400'}`}
          >
            Status: {member.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="text-gray-primary flex flex-col items-center gap-[5px] text-xs leading-[17px] font-normal">
          <span className="flex items-center gap-2">
            <Icons.mail className="h-[16px] w-[16px]" />
            {member.email}
          </span>
          <span className="flex items-center gap-2">
            <Icons.ri_contacts_book_line className="h-[16px] w-[16px]" />
            {member.mobile || 'N/A'}
          </span>
          <span className="flex items-center gap-2">
            <Icons.ri_user_line className="h-[16px] w-[16px]" />
            {member.access_levels}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberInfo;
