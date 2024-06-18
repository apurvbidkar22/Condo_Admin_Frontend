export interface User {
  id?: string;
  name?: string;
  email?: string
  roleId?: string;
  roleName?: string
  isActive?: string;
  action?: string;
  description?: string
  phoneNumber?: string
  permissions?: Permission[]
}

export interface SubPermission {
  menuId: string;
  section: string;
  displayName: string;
  isRead: boolean;
  isWrite: boolean;
  isDelete: boolean;
  subPermissions?: SubPermission[];
};

export interface Permission {
  id?: string;
  menuId: string;
  section: string;
  displayName: string;
  isRead: boolean;
  isWrite: boolean;
  isDelete: boolean;
  subPermissions?: SubPermission[];
};


export interface AssignedBuildings {
  id: number
  name: string
  city: string
  state: string
  neighbourhood: string
  zip: string
  volume: number
  actions?: string
}

export interface RolePermission {
  id?: string;
  roleName?: string
  permissions?: Permission[]
}

export interface UsersResponse {
  count: number
  rows: User[]
}



