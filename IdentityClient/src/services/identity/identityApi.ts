import { createApi } from '@reduxjs/toolkit/query/react';
import { identityBaseQuery } from '../auth/baseQueryWithReauth';

// Updated enums to match Swagger documentation
export enum SortBy { 
  Id = 'Id', 
  Email = 'Email',
  FirstName = 'FirstName',
  LastName = 'LastName'
}

export enum Sort { 
  Asc = 'Asc', 
  Desc = 'Desc' 
}

export enum ToggleUserValue { 
  IsActive = 'IsActive', 
  IsLockedOut = 'IsLockedOut', 
  IsEmailConfirmed = 'IsEmailConfirmed' 
}

export enum FindBy {
  Id = 'Id',
  Email = 'Email'
}

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
  requires2fa?: boolean;
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

export const identityApi = createApi({
  reducerPath: 'identityApi',
  baseQuery: identityBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Get all users - matches /api/account/users
    getUsers: builder.query({
      query: () => 'api/account/users',
      providesTags: ['User']
    }),
    
    // Get paged users - matches /api/account/pagedusers with proper parameters
    getUsersPaged: builder.query<UserResponseGetModelPaginatedResult, any>({
      query: (params) => ({
        url: 'api/account/pagedusers',
        params: {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
          sortBy: params.sortBy || SortBy.Id,
          order: params.order || Sort.Desc,
          searchTerm: params.searchTerm
        }
      }),
      providesTags: ['User']
    }),
    
    // Get user by ID or email - matches /api/account/userby
    getUserBy: builder.query({
      query: ({findBy, value}) => ({
        url: 'api/account/userby',
        params: {
          findBy,
          value
        }
      }),
      providesTags: (_, __, {value}) => [{ type: 'User', id: value }]
    }),
    
    // Update user - matches /api/account/update
    updateUser: builder.mutation({
      query: (data) => ({
        url: 'api/account/update',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (_, __, data) => [{ type: 'User', id: data.id }, 'User']
    }),
    
    // Delete user - matches /api/account/update with DELETE method
    deleteUser: builder.mutation({
      query: (id) => ({
        url: 'api/account/update',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: ['User']
    }),
    
    // Toggle user status - matches /api/account/togglestatus
    toggleUserStatus: builder.mutation({
      query: (data) => ({
        url: 'api/account/togglestatus',
        method: 'POST',
        params: {
          identifier: data.identifier,
          toggleValue: data.toggleValue
        }
      }),
      invalidatesTags: ['User']
    })
  })
});

export const {
  useGetUsersQuery,
  useGetUsersPagedQuery,
  useGetUserByQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation
} = identityApi;