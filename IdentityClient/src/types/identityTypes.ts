export interface UserResponseGetModel {
  id: string;
  email: string;
  userName: string;
  name: string;
  imageUrl: string;
  isActive: boolean;
  role: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

export interface UserResponseGetModelPaginatedResult {
  success: boolean;
  data: UserResponseGetModel[];
  errors: string[] | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  length?: number;
  map?: <T>(callback: (value: UserResponseGetModel, index: number) => T) => T[];
  find?: (predicate: (value: UserResponseGetModel) => boolean) => UserResponseGetModel | undefined;
  filter?: (predicate: (value: UserResponseGetModel) => boolean) => UserResponseGetModel[];
}

export interface UserInRoleDto {
  userId: string;
  userName: string;
  email: string;
  fullName: string;
}

export interface UserInRoleDtoListResult {
  success: boolean;
  data: UserInRoleDto[];
  errors: string[] | null;
  length?: number;
  map?: <T>(callback: (value: UserInRoleDto, index: number) => T) => T[];
  find?: (predicate: (value: UserInRoleDto) => boolean) => UserInRoleDto | undefined;
  filter?: (predicate: (value: UserInRoleDto) => boolean) => UserInRoleDto[];
}

export interface UpdateUserCommand {
  id: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
}

export interface DeleteUserCommand {
  id: string;
}

export interface UserActivityModel {
  id: string;
  userId: string;
  activityType: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  isSuccessful: boolean;
  additionalInfo?: string;
}

export interface UserActivityModelListResult {
  success: boolean;
  data: UserActivityModel[];
  errors: string[] | null;
  length?: number;
  map?: <T>(callback: (value: UserActivityModel, index: number) => T) => T[];
  find?: (predicate: (value: UserActivityModel) => boolean) => UserActivityModel | undefined;
  filter?: (predicate: (value: UserActivityModel) => boolean) => UserActivityModel[];
}

export interface StringListResult {
  success: boolean;
  data: string[];
  errors: string[] | null;
  length?: number;
  map?: <T>(callback: (value: string, index: number) => T) => T[];
  find?: (predicate: (value: string) => boolean) => string | undefined;
  filter?: (predicate: (value: string) => boolean) => string[];
}

export interface RoleResult {
  roleName: string;
  message: string;
}

export interface RoleResultResult {
  success: boolean;
  data: RoleResult;
  errors: string[] | null;
}