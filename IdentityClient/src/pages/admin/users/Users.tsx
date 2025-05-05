import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  UserCheck,
  UserX,
  Unlock,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  MailCheck,
  KeyRound,
  ChevronDown,
  Filter,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import {
  useGetUsersPagedQuery,
  useToggleUserStatusMutation,
  SortBy,
  Sort,
  ToggleUserValue
} from '@/services/identity/identityApi';

const Users = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Id);
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.Desc);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const { data: usersData, isLoading, refetch } = useGetUsersPagedQuery({
    pageNumber,
    pageSize,
    sortBy,
    order: sortOrder,
  });

  const [toggleUserStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuOpen && !((event.target as Element).closest('.action-menu'))) {
        setActionMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [actionMenuOpen]);

  const filteredUsers = usersData?.data.filter(user => {
    if (!debouncedSearchTerm && selectedFilter === 'all') return true;

    let matchesSearch = true;
    let matchesFilter = true;

    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      matchesSearch = (
        user.email.toLowerCase().includes(searchLower) ||
        (user.name?.toLowerCase() || '').includes(searchLower) ||
        (user.role?.toLowerCase() || '').includes(searchLower)
      );
    }

    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'active':
          matchesFilter = user.isActive;
          break;
        case 'inactive':
          matchesFilter = !user.isActive;
          break;
        case 'admin':
          matchesFilter = (user.role?.toLowerCase() || '').includes('admin');
          break;
        case 'user':
          matchesFilter = (user.role?.toLowerCase() || '').includes('user');
          break;
      }
    }

    return matchesSearch && matchesFilter;
  });

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await toggleUserStatus({
        identifier: userId,
        toggleValue: ToggleUserValue.IsActive
      }).unwrap();

      toast.success(`User ${isActive ? 'deactivated' : 'activated'} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleToggleLocked = async (userId: string, isLocked: boolean) => {
    try {
      await toggleUserStatus({
        identifier: userId,
        toggleValue: ToggleUserValue.IsLockedOut
      }).unwrap();

      toast.success(`User ${isLocked ? 'unlocked' : 'locked'} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update user lock status');
      console.error('Failed to toggle user lock status:', error);
    }
  };

  const handleToggleEmailVerified = async (userId: string, isEmailVerified: boolean) => {
    try {
      await toggleUserStatus({
        identifier: userId,
        toggleValue: ToggleUserValue.IsEmailConfirmed
      }).unwrap();

      toast.success(`User email ${isEmailVerified ? 'marked as unverified' : 'marked as verified'} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update email verification status');
      console.error('Failed to toggle email verification status:', error);
    }
  };

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === Sort.Asc ? Sort.Desc : Sort.Asc);
    } else {
      setSortBy(field);
      setSortOrder(Sort.Asc);
    }
  };

  const getSortIcon = (field: SortBy) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortOrder === Sort.Asc ?
      <ChevronDown className="h-4 w-4 ml-1 rotate-180" /> :
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage user accounts, permissions, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/users/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            Add User
          </Link>
        </div>
      </div>

      <div className="bg-card shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative rounded-md shadow-sm max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-12 py-2 sm:text-sm border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:ring-primary focus:border-primary"
                placeholder="Search users..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={pageSize.toString()}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="block w-full pl-3 pr-10 py-2 text-base border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedFilter === 'all'
                          ? 'bg-primary/10 text-primary border-primary'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted'
                      } border transition-colors`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSelectedFilter('active')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedFilter === 'active'
                          ? 'bg-green-500/10 text-green-500 border-green-500'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted'
                      } border transition-colors`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setSelectedFilter('inactive')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedFilter === 'inactive'
                          ? 'bg-red-500/10 text-red-500 border-red-500'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted'
                      } border transition-colors`}
                    >
                      Inactive
                    </button>
                    <button
                      onClick={() => setSelectedFilter('admin')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedFilter === 'admin'
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted'
                      } border transition-colors`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => setSelectedFilter('user')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedFilter === 'user'
                          ? 'bg-purple-500/10 text-purple-500 border-purple-500'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted'
                      } border transition-colors`}
                    >
                      Regular User
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  {/* ID column removed and merged with email */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer" onClick={() => handleSort(SortBy.Email)}>
                    <div className="flex items-center">
                      Email {getSortIcon(SortBy.Email)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer" onClick={() => handleSort(SortBy.FirstName)}>
                    <div className="flex items-center">
                      Name {getSortIcon(SortBy.FirstName)}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  {/* Status column removed as it's redundant with the status shown under email */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    {/* ID column moved to email section */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">{user.email}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={user.id}>ID: {user.id}</div>
                          <div className="flex mt-1">
                            {user.isActive ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="mr-1 h-3 w-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="mr-1 h-3 w-3" /> Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {user.name || 'Not Available'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield className="mr-1 h-3 w-3" /> {user.role || 'User'}
                      </span>
                    </td>
                    {/* Status column removed as it's redundant */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      <div className="flex items-center space-x-2 relative">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="View User Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          className={`${user.isActive ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'} transition-colors`}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          disabled={isToggling}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>

                        <div className="relative action-menu">
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {actionMenuOpen === user.id && (
                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                              <button
                                onClick={() => {
                                  handleToggleLocked(user.id, false);
                                  setActionMenuOpen(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <div className="flex items-center">
                                  <Unlock className="mr-2 h-4 w-4" />
                                  Unlock Account
                                </div>
                              </button>
                              <button
                                onClick={() => {
                                  handleToggleEmailVerified(user.id, false);
                                  setActionMenuOpen(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <div className="flex items-center">
                                  <MailCheck className="mr-2 h-4 w-4" />
                                  Verify Email
                                </div>
                              </button>
                              <Link
                                to={`/admin/users/${user.id}/reset-password`}
                                onClick={() => setActionMenuOpen(null)}
                                className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <div className="flex items-center">
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  Reset Password
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {debouncedSearchTerm ? `No users matching "${debouncedSearchTerm}"` : 'No users available'}
              </p>
              {debouncedSearchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {usersData && usersData.totalPages > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-border sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{(pageNumber - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(pageNumber * pageSize, usersData.totalCount)}</span> of{' '}
                  <span className="font-medium">{usersData.totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPageNumber(pageNumber - 1)}
                    disabled={!usersData.hasPreviousPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors ${!usersData.hasPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>

                  {Array.from({ length: usersData.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPageNumber(page)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        page === pageNumber
                          ? 'z-10 bg-primary/10 border-primary text-primary'
                          : 'border-border bg-card text-foreground hover:bg-muted'
                      } text-sm font-medium transition-colors`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setPageNumber(pageNumber + 1)}
                    disabled={!usersData.hasNextPage}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors ${!usersData.hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
