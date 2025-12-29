export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  roles: string[];
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleIds?: number[];
}
