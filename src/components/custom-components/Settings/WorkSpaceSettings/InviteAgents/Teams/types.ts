import { SubmitHandler } from 'react-hook-form';

// add members types

export type TeamsFormValues = {
  email: string;
  fullName: string;
  role: string;
};

export interface AddTeamsMemberProps {
  defaultValues?: Partial<TeamsFormValues>;
  onSubmit: (data: any) => void;
}

// create team types
export type CreateTeamFormValues = {
  newteam: string;
};

export interface CreateTeamProps {
  defaultValues?: Partial<CreateTeamFormValues>;
  // onSubmit: Subm  // onSubmit: SubmitHandler<FormValues>;
  onSubmit: () => void;
  onCancel?: () => void;
}

// team edit data types

export type EditTeamFormValues = {
  teamname: string;
  members: Record<number, string>; // memberId -> access_level
};

export interface TeamEditProps {
  defaultValues?: Partial<EditTeamFormValues>;
  onSubmit: SubmitHandler<EditTeamFormValues>;
  data?: {
    data: {
      member_id: number;
      username: string;
      access_levels: string;
    }[];
  };
  teamId?: number;
}

//team member info
export interface TeamMember {
  member_id: number;
  username: string;
  access_levels?: string;
  email?: string;
  mobile?: string;
  is_active?: boolean;
}

export interface TeamMemberInfoProps {
  memberInfo?: { data: TeamMember[] }; // optional because `data` can be undefined
  memberId: number | null;
}

// team table  types

export interface TeamTableOrderRow {
  id: string;
  TeamName: string;
  Lead: string;
  Status: string;
  Actions: string;
}

export interface TeamTableColumn<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface TeamTableProps {
  handleOpenDialog: (options: {
    heading: string;
    subheading: string;
    onAction: () => void;
    headericon: React.ReactNode;
  }) => void;
}

export type TeamFormValues = {
  newteam: string;
  email: string;
  fullName: string;
  role: string;
  // description: string;
};

// member_id -> access_level
export type EditTeamMemberFormValues = {
  members: Record<number, string>;
};

export type MemberAccess = {
  member_id: number;
  access_level: string;
};

export type EditTeamMemberHandler = (data: EditTeamMemberFormValues) => void;

//TEAM VIEW

// Define a type for each team member
export type TeamMemberView = {
  member_id: number;
  username: string;
};

// Define the structure of the API response
export type TeamMembersResponse = {
  data: TeamMemberView[];
  // add other response fields if they exist
};

export interface TeamViewProps {
  teamId: number;
  data?: TeamMembersResponse; // use the same type from the API
}
