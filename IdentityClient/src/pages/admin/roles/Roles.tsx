import { useState, useEffect } from 'react';
import { 
  Shield, 
  UserPlus, 
  Trash2, 
  UserX, 
  Plus, 
  Search,
  User,
  Users as UsersIcon,
  CheckCircle,
  X
} from 'lucide-react';
import { 
  useGetAllRolesQuery, 
  useCreateRoleMutation, 
  useDeleteRoleMutation,
  useGetRoleUsersQuery,
  useAddUserToRoleMutation,
  useRemoveUserFromRoleMutation
} from '@/services/roles/rolesApi';
import { useGetUsersPagedQuery } from '@/services/identity/identityApi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Roles = () => {
  // State management
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // API queries
  const { data: rolesData, isLoading: rolesLoading, refetch: refetchRoles, error: rolesError } = useGetAllRolesQuery();
  const roles = rolesData?.data || [];
  
  const { data: roleUsers, isLoading: roleUsersLoading, refetch: refetchRoleUsers } = useGetRoleUsersQuery(
    selectedRole || '', 
    { 
      skip: !selectedRole,
      refetchOnMountOrArgChange: true
    }
  );
  
  const { data: allUsers, isLoading: allUsersLoading, refetch: refetchAllUsers } = 
    useGetUsersPagedQuery({ pageNumber: 1, pageSize: 50, searchTerm: userSearchTerm }, {
      refetchOnMountOrArgChange: true
    });
    
  // Extract users from the paginated response ensuring type safety
  const users = allUsers?.data && ('items' in allUsers.data) 
    ? (allUsers.data as any).items 
    : Array.isArray(allUsers?.data) 
      ? allUsers.data 
      : [];
  
  // Mutations
  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();
  const [assignUserToRole, { isLoading: isAssigningUserLoading }] = useAddUserToRoleMutation();
  const [removeUserFromRole, { isLoading: isRemovingUserLoading }] = useRemoveUserFromRoleMutation();
  
  // Error handling
  useEffect(() => {
    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      toast.error('Failed to load roles');
    }
  }, [rolesError]);
  
  // Set initial role when data loads and fetch its users
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
      console.log('Setting initial selected role:', roles[0]);
    }
  }, [roles, selectedRole]);
  
  // Refetch role users when role selection changes
  useEffect(() => {
    if (selectedRole) {
      refetchRoleUsers();
    }
  }, [selectedRole, refetchRoleUsers]);
  
  // Create a new role
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error('Role name cannot be empty');
      return;
    }
    
    try {
      await createRole({ roleName: newRoleName }).unwrap();
      toast.success(`Role '${newRoleName}' created successfully`);
      setNewRoleName('');
      setIsAddingRole(false);
      refetchRoles();
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
    }
  };
  
  // Delete a role
  const handleDeleteRole = async (roleName: string) => {
    if (!confirm(`Are you sure you want to delete role '${roleName}'?`)) return;
    
    try {
      await deleteRole(roleName).unwrap();
      toast.success(`Role '${roleName}' deleted successfully`);
      
      if (selectedRole === roleName) {
        const nextRole = roles.find(r => r !== roleName) || null;
        setSelectedRole(nextRole);
      }
      
      refetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };
  
  // Toggle user selection for role assignment
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  // Check if user is assigned to the selected role
  const isUserInRole = (userId: string) => {
    if (!roleUsers?.data) return false;
    return roleUsers.data.some(user => user.userId === userId);
  };
  
  const getAssignedUserIds = () => {
    if (!roleUsers?.data) return [];
    return roleUsers.data.map(user => user.userId);
  };
  
  // Assign selected users to the selected role
  const handleAssignSelectedUsers = async () => {
    if (!selectedRole || selectedUsers.length === 0) {
      toast.error('Please select a role and at least one user');
      return;
    }
    
    try {
      let successCount = 0;
      let errorCount = 0;
      
      for (const userId of selectedUsers) {
        try {
          await assignUserToRole({ roleName: selectedRole, userId }).unwrap();
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} user${successCount > 1 ? 's' : ''} assigned to role successfully`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to assign ${errorCount} user${errorCount > 1 ? 's' : ''}`);
      }
      
      setSelectedUsers([]);
      refetchRoleUsers();
    } catch (error) {
      toast.error('Error assigning users to role');
    }
  };
  
  // Remove a user from the selected role
  const handleRemoveUserFromRole = async (userId: string) => {
    if (!selectedRole) return;
    
    try {
      await removeUserFromRole({ 
        roleName: selectedRole, 
        userId 
      }).unwrap();
      toast.success('User removed from role');
      refetchRoleUsers();
      refetchAllUsers();
    } catch (error) {
      console.error('Error removing user from role:', error);
      toast.error('Failed to remove user from role');
    }
  };
  
  // Filter users for the current view
  const filteredUsers = (users as any[]).filter(user => 
    (user.userName || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(userSearchTerm.toLowerCase())
  );
  
  if (rolesLoading) {
    return (
      <div className="flex flex-col min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center text-foreground">
          <Shield className="mr-2 h-6 w-6 text-primary" />
          Role Management
        </h1>
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center">
          <Shield className="h-6 w-6 mr-2 text-primary" />
          Role Management
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddingRole(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {/* Role list - Left side */}
        <div className="md:col-span-2 bg-card rounded-lg shadow-sm p-4 border border-border h-[calc(100vh-13rem)]">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Roles</h2>
          <div className="space-y-2 overflow-y-auto max-h-[calc(100%-3rem)]">
            {roles.length > 0 ? (
              roles.map((role) => (
                <div
                  key={role}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                    selectedRole === role ? 'bg-primary/10 border-primary/30' : 'bg-background hover:bg-muted'
                  } border border-border transition-colors`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="flex items-center">
                    <Shield className={`h-5 w-5 mr-2 ${selectedRole === role ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`${selectedRole === role ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {role}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRole(role);
                    }}
                    className="text-muted-foreground hover:text-destructive rounded-full p-1 hover:bg-background transition-colors"
                    disabled={isDeletingRole}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No roles found
              </div>
            )}
          </div>
        </div>
        
        {/* Users and role assignment - Right side */}
        <div className="md:col-span-5 bg-card rounded-lg shadow-sm border border-border h-[calc(100vh-13rem)] flex flex-col">
          {selectedRole ? (
            <>
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {selectedRole} Role Management
                </h2>
                <p className="text-sm text-muted-foreground">
                  {roleUsersLoading 
                    ? 'Loading user data...' 
                    : `${roleUsers?.data?.length || 0} users assigned to this role.`
                  }
                </p>
                <p className="mt-1 text-xs text-primary/80">
                  Click on a user to select for assignment. Use the red X to remove from role.
                </p>
              </div>
              
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-border bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              
              <div className="p-4 flex-grow overflow-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <h3 className="text-sm font-medium text-foreground">Users in System</h3>
                    <div className="text-xs text-muted-foreground sm:ml-3">
                      {selectedUsers.length} selected
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary">
                      <CheckCircle className="h-3 w-3 mr-1" /> In role
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-muted-foreground">
                      <Plus className="h-3 w-3 mr-1" /> Available
                    </span>
                  </div>

                </div>
                
                {allUsersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found matching your search
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredUsers.map((user) => {
                      const inRole = isUserInRole(user.id);
                      return (
                        <div 
                          key={user.id} 
                          onClick={() => !inRole && toggleUserSelection(user.id)}
                          className={`flex items-center justify-between p-3 rounded-md border ${
                            inRole 
                              ? 'bg-primary/5 border-primary/20' 
                              : selectedUsers.includes(user.id)
                                ? 'bg-muted/80 border-border'
                                : 'bg-background border-border hover:bg-muted/30'
                          } transition-all ${!inRole ? 'cursor-pointer' : ''}`}
                        >
                          <div className="flex items-center">
                            <div className="flex items-center min-w-0">
                              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div className="ml-3 overflow-hidden">
                                <div className="text-sm font-medium text-foreground truncate">{user.userName}</div>
                                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            {inRole ? (
                              <div className="flex items-center">
                                <span className="text-xs text-primary mr-2 flex items-center">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Assigned
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveUserFromRole(user.id);
                                  }}
                                  disabled={isRemovingUserLoading}
                                  className="text-muted-foreground hover:text-destructive rounded-full p-1.5 hover:bg-destructive/10 transition-colors"
                                >
                                  <UserX className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleUserSelection(user.id);
                                }}
                                className={`p-2 rounded-md transition-colors ${
                                  selectedUsers.includes(user.id)
                                    ? 'bg-primary/20 text-primary hover:bg-primary/30'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                              >
                                {selectedUsers.includes(user.id) ? (
                                  <X className="h-4 w-4" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1.5 text-primary" />
                    <span>
                      {roleUsersLoading 
                        ? 'Loading...' 
                        : `${roleUsers?.data?.length || 0} users assigned to this role`
                      }
                    </span>
                  </h3>
                  
                  <div className="flex gap-2">
                    {getAssignedUserIds().length > 0 && (
                      <button 
                        onClick={() => refetchRoleUsers()}
                        className="text-xs px-2 py-1 rounded-md border border-border bg-background hover:bg-muted transition-colors"
                      >
                        Refresh list
                      </button>
                    )}
                    
                    {selectedUsers.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleAssignSelectedUsers}
                          disabled={isAssigningUserLoading}
                          className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {isAssigningUserLoading ? (
                            <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-1"></div>
                          ) : (
                            <UserPlus className="h-3 w-3 mr-1" />
                          )}
                          Assign ({selectedUsers.length})
                        </button>
                        <button
                          onClick={() => setSelectedUsers([])}
                          className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Shield className="h-12 w-12 mb-3 opacity-20" />
              <p>Select a role to manage its users</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Role Modal */}
      <AnimatePresence>
        {isAddingRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsAddingRole(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-foreground">Create New Role</h2>
              <div className="mb-4">
                <label htmlFor="roleName" className="block text-sm font-medium text-foreground mb-1">
                  Role Name
                </label>
                <input
                  id="roleName"
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full p-2 rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Enter role name..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingRole(false)}
                  className="px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRole}
                  disabled={isCreatingRole || !newRoleName.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isCreatingRole ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>Create Role</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Roles;
