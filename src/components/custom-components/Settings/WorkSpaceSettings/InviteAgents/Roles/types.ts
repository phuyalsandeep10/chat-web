// role table types
export type PermissionState = {
  permission_id: number;
  is_changeable: boolean;
  is_viewable: boolean;
  is_deletable: boolean;
};

export type RoleFormValues = {
  name: string;
  id?: number;
  role_id?: number;
  permissions?: PermissionState[];
  groups?: string[];
};

export interface RoleFormProps {
  defaultValues?: Partial<RoleFormValues>;
  onSubmit: (data: RoleFormValues) => void;
  roleHead: string;
  setOpenCreateRole?: React.Dispatch<React.SetStateAction<boolean>>;
}

export type RoleOrderRow = {
  permissions: string;
  id?: number;
  is_changeable?: boolean;
  is_viewable?: boolean;
  is_deletable?: boolean;
};

export type RoleColumn<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

// ROLE TABLE PROPS

export interface RoleTableOrderRow {
  RoleName: string;
  agents: number;
  permission: string;
  date: string;
  Actions: string;
}

export interface RolesTableProps {
  handleOpenDialog: (options: {
    heading: string;
    subheading: string;
    onAction: () => void;
    headericon?: React.ReactNode;
  }) => void;
}
