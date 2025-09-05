import { Control } from 'react-hook-form';
import { AddOrEditAgentFormSchema } from './FormSchema';

// ADD OR EDIT AGENT FORM

export type AddorEditFormValues = {
  role_ids?: number[];
  email: string;
  fullName: string;
  role: string[];
  clientHandled: string;
  days: string[];
  shift: string;
  startTime: string;
  endTime: string;
  totalHours: string;
  team: string;
};

export type Team = { value: string; label: string };
export type Role = { role_id: number; role_name: string };

// to remove from this file
export type RolePermission = {
  role_id: number; // add this
  role_name: string;
};

export interface AddOrEditAgentFormProps {
  defaultValues?: Partial<AddorEditFormValues> & { id?: number };
  onSubmit?: (data: AddorEditFormValues) => void;
  submitButton?: string;
  onClose?: () => void;
}

// AGENT CHAT HISTORY

export type AgentChatHistoryRole = {
  role_name: string;
};

export type AgentChatHistoryFormValues = {
  role: string;
};

export interface Operator {
  id: number;
  user_name: string;
  email?: string;
  shift?: string;
  startTime?: string;
  endTime?: string;
  client_handled?: string;
  totalHours?: string;
  team?: string;
  day?: string;
  roles?: AgentChatHistoryRole[];
}

export interface AgenChatHistoryCardProps {
  headerIconClass?: string;
  headericon?: React.ReactNode;
  iconClass?: string;
  defaultValues?: Partial<AgentChatHistoryFormValues>;
  onSubmit?: (data: AgentChatHistoryFormValues) => void;
  submitButton?: string;
  operatorsData?: Operator[];
  selectedOperator?: Operator | null;
}

// AGENT INVITE MODAL

export type AgentInviteModalProps = {
  open?: boolean; // allow controlled use
  onOpenChange?: (open: boolean) => void;
  children?: any;
  dialogClass?: string;
  dialogTitle?: string;
  dialogDescription?: string;
};

//INVITE AGENTS TABLE SettingsHeader

// Define the modalProps type
export type ModalProps = {
  heading: string;
  subheading: string;
  onAction: () => void;
  headericon?: React.ReactNode; // Use ReactNode for components, strings, etc.
};

// OPERATIONS TABLE

export interface OperatorsOrderRow {
  id: string;
  FullName: string;
  Roles: string;
  Shift: string;
  OperatingHours: string;
  Invitedon: string;
  Actions: string;
}

export interface OperatorColumn<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface OperatorsTableProps {
  handleOpenDialog: (props: {
    heading: string;
    subheading: string;
    onAction: () => void;
    headericon?: React.ReactNode;
  }) => void;
}

// REUSABLE TABLE

export type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

export type GenericTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  tableClassName?: string;
  headerClassName?: string;
};

// from here

type RolePermissionGroupResponse = {
  roles: Role[];
  status: string;
};

export type FieldProps = {
  control: Control<AddOrEditAgentFormSchema>;
  roleTableData?: {
    data?: RolePermission[]; // <- allow undefined
    errorMessage?: string;
  };
  errorMessage?: string;
};
