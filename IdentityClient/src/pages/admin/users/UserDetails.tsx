import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  MailCheck,
  Edit,
  Trash2,
  KeyRound,
  CheckCircle,
  XCircle,
  Clock,
  FileEdit
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import {
  useGetUserByQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  FindBy,
  ToggleUserValue
} from '@/services/identity/identityApi';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  console.log('UserDetails - Current ID:', id);

  const { data: userData, isLoading, error, refetch } = useGetUserByQuery({
    findBy: FindBy.Id,
    value: id!
  }, {
    skip: !id
  });

  console.log('UserDetails - API Response:', { userData, error, isLoading });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [toggleUserStatus, { isLoading: isToggling }] = useToggleUserStatusMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: ''
  });

  useEffect(() => {
    if (userData) {
      const names = userData.name?.split(' ') || ['', ''];
      setFormData({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        userName: userData.userName || '',
        email: userData.email || ''
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUser({
        id: id!,
        ...formData
      }).unwrap();

      toast.success('User updated successfully');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(id!).unwrap();
      toast.success('User deleted successfully');
      navigate('/admin/users');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Failed to delete user:', error);
    }
  };

  const handleToggleActive = async () => {
    try {
      await toggleUserStatus({
        identifier: id!,
        toggleValue: ToggleUserValue.IsActive
      }).unwrap();

      toast.success(`User ${userData?.isActive ? 'deactivated' : 'activated'} successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleToggleLocked = async () => {
    try {
      await toggleUserStatus({
        identifier: id!,
        toggleValue: ToggleUserValue.IsLockedOut
      }).unwrap();

      toast.success('User account lock status updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update user lock status');
      console.error('Failed to toggle user lock status:', error);
    }
  };

  const handleToggleEmailVerified = async () => {
    try {
      await toggleUserStatus({
        identifier: id!,
        toggleValue: ToggleUserValue.IsEmailConfirmed
      }).unwrap();

      toast.success('Email verification status updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update email verification status');
      console.error('Failed to toggle email verification status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Link to="/admin/users" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Link>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error Loading User</h2>
          <p>There was a problem loading the user details. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!userData || !userData) {
    return (
      <div className="p-6">
        <Link to="/admin/users" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Link>
        <div className="bg-muted p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">User Not Found</h2>
          <p>The requested user details could not be found.</p>
        </div>
      </div>
    );
  }

  const user = userData;
  console.log('User data content:', user);

  if (!user) {
    return (
      <div className="text-center mt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 mb-4">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground">User not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The requested user could not be found
        </p>
        <Link
          to="/admin/users"
          className="mt-4 inline-flex items-center px-3 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link
            to="/admin/users"
            className="mr-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">User Details</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            disabled={isUpdating}
          >
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </>
            )}
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-red-500 rounded-md shadow-sm text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-card shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="inline-flex h-24 w-24 rounded-full bg-primary/10 items-center justify-center mb-4">
              <User className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{user.name || 'Unnamed User'}</h2>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300'}`}>
                {user.isActive ? <UserCheck className="mr-1 h-3 w-3" /> : <UserX className="mr-1 h-3 w-3" />}
                {user.isActive ? 'Active' : 'Inactive'}
              </span>

              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300">
                <Shield className="mr-1 h-3 w-3" />
                {user.role || 'User'}
              </span>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleToggleActive}
                  className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${user.isActive
                    ? 'border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'border-green-300 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}
                  disabled={isToggling}
                >
                  {user.isActive ? (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate User
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Activate User
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleLocked}
                  className="inline-flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  disabled={isToggling}
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Unlock Account
                </button>

                <button
                  onClick={handleToggleEmailVerified}
                  className="inline-flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  disabled={isToggling}
                >
                  <MailCheck className="mr-2 h-4 w-4" />
                  Verify Email
                </button>

                <Link
                  to={`/admin/users/${user.id}/reset-password`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Reset Password
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* User Details/Edit Form */}
        <div className="md:col-span-2 bg-card shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">
              {isEditing ? 'Edit User Information' : 'User Information'}
            </h3>
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-foreground">
                      Username
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="userName"
                        id="userName"
                        value={formData.userName}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="ml-2 text-sm font-medium text-muted-foreground">Full Name</span>
                    </div>
                    <div className="mt-1 text-foreground">{user.name || 'Not Available'}</div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span className="ml-2 text-sm font-medium text-muted-foreground">Email</span>
                    </div>
                    <div className="mt-1 text-foreground">{user.email}</div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <span className="ml-2 text-sm font-medium text-muted-foreground">Role</span>
                    </div>
                    <div className="mt-1 text-foreground">{user.role || 'User'}</div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="ml-2 text-sm font-medium text-muted-foreground">Created Date</span>
                    </div>
                    <div className="mt-1 text-foreground">
                      {user.createdDate ? new Date(user.createdDate).toLocaleDateString() : 'Not Available'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="text-sm font-medium text-foreground mb-4">Account Status</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-muted-foreground" />
                        <span className="ml-2 text-sm font-medium text-foreground">Active Status</span>
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <span className="ml-2 text-sm font-medium text-foreground">Account Lock</span>
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${false ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300'}`}>
                        {false ? 'Locked' : 'Unlocked'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center">
                        <MailCheck className="h-5 w-5 text-muted-foreground" />
                        <span className="ml-2 text-sm font-medium text-foreground">Email Verification</span>
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${true ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300'}`}>
                        {true ? 'Verified' : 'Unverified'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="ml-2 text-sm font-medium text-foreground">Last Update</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.updatedDate ? new Date(user.updatedDate).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

          {/* Modal container */}
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0 relative z-50">
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <motion.div
              className="inline-block align-bottom bg-card rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-border"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-foreground">Delete User</h3>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete this user? This action cannot be undone and all associated data will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-border shadow-sm px-4 py-2 bg-card text-base font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
