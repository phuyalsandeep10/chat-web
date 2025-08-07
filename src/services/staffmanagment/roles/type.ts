export interface CreateRoles {
  name: string;
  description?: string;
  permissions: [
    {
      permission_id: number;
      is_changeable: bool;
      is_deletable: bool;
      is_viewable: bool;
    },
  ];
}
