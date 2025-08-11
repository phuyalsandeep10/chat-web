import { create } from 'zustand';

interface Permission {
  permission_id: number;
  is_changeable: boolean;
  is_viewable: boolean;
  is_deletable: boolean;
}

interface Role {
  id?: string;
  name: string;
  permissions: Permission[];
}

interface RoleStore {
  roles: Role[];
  selectedRole: Role | null;
  setRoles: (roles: Role[]) => void;
  setSelectedRole: (role: Role | null) => void;
  updatePermission: (
    permission_id: number,
    updated: Partial<Permission>,
  ) => void;
  updateRoleName: (name: string) => void;
  resetSelectedRole: () => void;
}

export const useRoleStore = create<RoleStore>((set, get) => ({
  roles: [],
  selectedRole: null,
  setRoles: (roles) => set({ roles }),
  setSelectedRole: (role) => set({ selectedRole: role }),
  updatePermission: (permissionId, changes) =>
    set((state) => ({
      selectedRole: {
        ...state.selectedRole,
        permissions: state.selectedRole.permissions.map((p) =>
          p.permission_id === permissionId ? { ...p, ...changes } : p,
        ),
      },
    })),
  updateRoleName: (name) => {
    const selectedRole = get().selectedRole;
    if (!selectedRole) return;
    set({
      selectedRole: {
        ...selectedRole,
        name,
      },
    });
  },
  resetSelectedRole: () => set({ selectedRole: null }),
}));
