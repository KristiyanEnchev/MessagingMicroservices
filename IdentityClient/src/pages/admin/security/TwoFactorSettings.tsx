import { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
  User,
  Search,
  RefreshCw
} from 'lucide-react';
import {
  useEnable2FAMutation,
  useDisable2FAMutation,
  useGenerate2FACodeMutation
} from '@/services/auth/twoFactorAuthApi';
import { useGetUsersPagedQuery } from '@/services/identity/identityApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Input } from '@/components/ui/Input';

const TwoFactorSettings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userIdToModify, setUserIdToModify] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [usersWithTwoFactor, setUsersWithTwoFactor] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const user = useSelector((state: RootState) => state.auth.user);

  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } =
    useGetUsersPagedQuery({ pageNumber: currentPage, pageSize, searchTerm });

  const [enable2FA, { isLoading: isEnabling }] = useEnable2FAMutation();
  const [disable2FA, { isLoading: isDisabling }] = useDisable2FAMutation();
  const [generate2FA] = useGenerate2FACodeMutation();

  useEffect(() => {
    if (user?.requires2fa !== undefined) {
      setIs2FAEnabled(user.requires2fa);
    }
  }, [user]);

  useEffect(() => {
    if (usersData?.data) {
      const twoFactorMap: Record<string, boolean> = {};
      usersData.data.forEach(user => {
        twoFactorMap[user.id] = user.requires2fa || false;
      });
      setUsersWithTwoFactor(twoFactorMap);
    }
  }, [usersData]);

  const handleToggle2FA = async () => {
    if (is2FAEnabled) {
      setUserIdToModify(user?.id || '');
      setShowConfirmation(true);
    } else {
      try {
        if (!user?.email) {
          toast.error('User email is required');
          return;
        }

        await enable2FA({ email: user.email }).unwrap();
        toast.success('Two-factor authentication enabled successfully');
        setIs2FAEnabled(true);

        const result = await generate2FA({ userId: user.id }).unwrap();
        if (result.success) {
          toast.success(`A verification code has been sent to your email`);
        }

        refetchUsers();
      } catch (error) {
        toast.error('Failed to enable two-factor authentication');
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleToggleUserTwoFactor = async (userId: string, userEmail: string, enable: boolean) => {
    try {
      if (enable) {
        await enable2FA({ email: userEmail }).unwrap();
        toast.success('Two-factor authentication enabled for user');

        setUsersWithTwoFactor(prev => ({
          ...prev,
          [userId]: true
        }));
      } else {
        setUserIdToModify(userId);
        setShowConfirmation(true);
      }
    } catch (error) {
      toast.error('Failed to modify two-factor authentication');
    }
  };

  const handleConfirmDisable = async () => {
    try {
      const targetUser = userIdToModify === user?.id
        ? user
        : usersData?.data.find(u => u.id === userIdToModify);

      if (!targetUser?.email) {
        toast.error('User email is required');
        return;
      }

      await disable2FA({ email: targetUser.email }).unwrap();
      toast.success('Two-factor authentication disabled successfully');

      if (userIdToModify === user?.id) {
        setIs2FAEnabled(false);
      }

      setUsersWithTwoFactor(prev => ({
        ...prev,
        [userIdToModify]: false
      }));

      setShowConfirmation(false);
      refetchUsers();
    } catch (error) {
      toast.error('Failed to disable two-factor authentication');
    }
  };

  const handleCancelDisable = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <Shield className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Two-Factor Authentication</h1>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Lock className="h-5 w-5 mr-2 text-primary" />
            Your Two-Factor Authentication (2FA)
          </h2>
          <p className="text-muted-foreground mb-6">
            Add an extra layer of security to your account by requiring a verification code in addition to your password when signing in.
          </p>

          <div className="flex items-center justify-between py-4 border-t border-border">
            <div>
              <div className="font-medium">Enable 2FA Protection</div>
              <div className="text-sm text-muted-foreground">
                {is2FAEnabled
                  ? 'Your account is protected with 2FA'
                  : 'Enhance your account security'}
              </div>
            </div>
            <Switch
              checked={is2FAEnabled}
              onChange={handleToggle2FA}
              disabled={isEnabling || isDisabling || showConfirmation}
            />
          </div>

          {showConfirmation && (
            <div className="mt-4 p-4 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-red-800 dark:text-red-300">Disable 2FA?</h3>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    This will reduce your account security. Are you sure you want to continue?
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleConfirmDisable}
                      isLoading={isDisabling}
                    >
                      Disable 2FA
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelDisable}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Manage User 2FA Settings
          </h2>
          <p className="text-muted-foreground mb-4">
            Enable or disable two-factor authentication for any user in the system.
          </p>

          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchUsers()}
              disabled={isLoadingUsers}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="border rounded-md">
            <div className="bg-muted/40 p-3 border-b flex justify-between items-center">
              <div className="font-medium">User</div>
              <div className="font-medium">2FA Status</div>
            </div>

            {isLoadingUsers ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : !usersData?.data?.length ? (
              <div className="p-6 text-center text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="divide-y">
                {usersData.data.filter(user =>
                  user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(user => (
                  <div key={user.id} className="relative">
                    <div className="p-3 flex justify-between items-center hover:bg-muted/20">
                      <div>
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <Switch
                        checked={usersWithTwoFactor[user.id] || false}
                        onChange={(e) => handleToggleUserTwoFactor(user.id, user.email, e.target.checked)}
                        disabled={isEnabling || isDisabling || (showConfirmation && userIdToModify === user.id)}
                      />
                    </div>

                    {showConfirmation && userIdToModify === user.id && (
                      <div className="mt-2 p-3 border-t border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                          <div>
                            <h3 className="font-medium text-red-800 dark:text-red-300">Disable 2FA?</h3>
                            <p className="text-sm text-red-700 dark:text-red-400 mt-1 mb-2">
                              This will reduce account security for {user.userName}. Are you sure?
                            </p>
                            <div className="flex space-x-3">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleConfirmDisable}
                                isLoading={isDisabling}
                              >
                                Disable 2FA
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelDisable}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination controls */}
            {!isLoadingUsers && usersData && usersData.totalPages > 1 && (
              <div className="mt-4 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoadingUsers}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, usersData.totalPages) }, (_, i) => {
                    let pageNum = currentPage;
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= usersData.totalPages - 2) {
                      pageNum = usersData.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum > 0 && pageNum <= usersData.totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === usersData.totalPages || isLoadingUsers}
                >
                  Next
                </Button>

                <select
                  className="ml-2 p-1 text-sm border rounded-md bg-background"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">How 2FA Works</h2>
          <div className="space-y-5 mt-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mr-4">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Sign In with Password</h3>
                <p className="text-sm text-muted-foreground">
                  Start by entering your email and password as usual
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mr-4">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Receive Verification Code</h3>
                <p className="text-sm text-muted-foreground">
                  A unique code is sent to your email
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mr-4">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Complete Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the code to gain access to your account
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TwoFactorSettings;
