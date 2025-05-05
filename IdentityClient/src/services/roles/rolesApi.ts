import { createApi } from '@reduxjs/toolkit/query/react';
import { identityBaseQuery } from '../auth/baseQueryWithReauth';

export interface StringListResult {
  success: boolean;
  data: string[];
  errors: string[] | null;
}

export interface RoleResultResult {
  success: boolean;
  data: {
    id: string;
    name: string;
  };
  errors: string[] | null;
}

export interface StringResult {
  success: boolean;
  data: string;
  errors: string[] | null;
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
}

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: identityBaseQuery,
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    getAllRoles: builder.query<StringListResult, void>({
      query: () => 'api/roles',
      providesTags: ['Role'],
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return {
            success: true,
            data: response,
            errors: null
          };
        }
        return {
          success: true,
          data: response.data || [],
          errors: null
        };
      }
    }),

    getRoleUsers: builder.query<UserInRoleDtoListResult, string | { roleName: string, pageNumber?: number, pageSize?: number }>({
      query: (arg) => {
        const roleName = typeof arg === 'string' ? arg : arg.roleName;
        const pageNumber = typeof arg === 'string' ? 1 : (arg.pageNumber || 1);
        const pageSize = typeof arg === 'string' ? 10 : (arg.pageSize || 10);

        console.log('Fetching users for role:', roleName);

        if (!roleName) {
          throw new Error('Role name is required but was undefined or empty');
        }

        return {
          url: `api/roles/${roleName}/users`,
          params: { pageNumber, pageSize }
        };
      },
      transformResponse: (response, meta, arg) => {
        if (!response) {
          return {
            success: true,
            data: [],
            errors: null
          };
        }

        if (Array.isArray(response)) {
          return {
            success: true,
            data: response,
            errors: null
          };
        }

        return {
          success: true,
          data: response.data || [],
          errors: null
        };
      },
      providesTags: ['Role'],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Error fetching users for role:', error);
        }
      }
    }),

    getUserRoles: builder.query<StringListResult, string>({
      query: (userId) => `api/roles/user/${userId}`,
      providesTags: (_, __, userId) => [{ type: 'Role', id: userId }]
    }),

    createRole: builder.mutation<RoleResultResult, { roleName: string }>({
      query: (data) => ({
        url: 'api/roles',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Role']
    }),

    deleteRole: builder.mutation<StringResult, string>({
      query: (roleName) => ({
        url: `api/roles/${roleName}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Role']
    }),

    addUserToRole: builder.mutation<StringResult, { userId: string, roleName: string }>({
      query: (data) => ({
        url: 'api/roles/add-user',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Role']
    }),

    removeUserFromRole: builder.mutation<StringResult, { userId: string, roleName: string }>({
      query: (data) => ({
        url: 'api/roles/remove-user',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Role']
    })
  })
});

export const {
  useGetAllRolesQuery,
  useGetRoleUsersQuery,
  useGetUserRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useAddUserToRoleMutation,
  useRemoveUserFromRoleMutation
} = rolesApi;
