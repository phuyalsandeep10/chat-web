// invite cclock types
export interface OrderRow {
  id: string;
  invite: string;
  invite_Sent: string;
  status: string;
  Roles: string;
  OperatingHours: string;
  Actions: string;
}

export interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface InviteAgentProps {
  handleOpenDialog: (props: {
    heading: string;
    subheading: string;
    onAction: () => void;
    headericon?: React.ReactNode;
    submitButton?: string;
  }) => void;
}

export type TimeType = {
  hours: number;
  minutes: number;
  period: 'AM' | 'PM';
};

export interface TimePickerProps {
  onClose: () => void;
  setFieldValue: (value: TimeType) => void;
  time?: Date | string;
}
