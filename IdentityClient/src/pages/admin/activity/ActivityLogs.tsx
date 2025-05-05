import { useState, useEffect } from 'react';
import { 
  Clock, 
  Filter, 
  User, 
  Activity,
  Calendar,
  Search,
  X,
  Trash2
} from 'lucide-react';
import { useGetUserActivityQuery, useClearUserActivityMutation, UserActivityFilterParams } from '@/services/activity/activityApi';
import { useGetUsersPagedQuery } from '@/services/identity/identityApi';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const ActivityTypeColors: Record<string, string> = {
  'Login': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'Logout': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'PasswordChange': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'PasswordReset': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  'ProfileUpdate': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'Registration': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'RoleAssigned': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'RoleRemoved': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'UserCreated': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'UserDeleted': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  'UserDisabled': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'UserEnabled': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
};

const ActivityLogs = () => {
  const [filters, setFilters] = useState<UserActivityFilterParams>({
    take: 50
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  
  // Handle Escape key press to close the modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedActivityId) {
        setSelectedActivityId(null);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [selectedActivityId]);
  
  const { data: activityResponse, isLoading, refetch } = useGetUserActivityQuery(filters);
  const activityData = activityResponse;
  const { data: usersData } = useGetUsersPagedQuery({ pageNumber: 1, pageSize: 100 });
  const [clearActivity] = useClearUserActivityMutation();
  const handleFilterChange = (key: keyof UserActivityFilterParams, value: string | undefined) => {
    if (!value) {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };
  
  const handleClearFilters = () => {
    setFilters({ take: 50 });
    setUserSearch('');
  };
  
  const handleClearActivity = async (userId: string) => {
    if (!confirm('Are you sure you want to clear all activity for this user?')) return;
    
    try {
      await clearActivity(userId).unwrap();
      toast.success('User activity cleared successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to clear user activity');
    }
  };
  
  const filteredUsers = usersData?.data ? usersData.data.filter((user: any) => 
    user.userName?.toLowerCase().includes(userSearch.toLowerCase()) || 
    user.email?.toLowerCase().includes(userSearch.toLowerCase())
  ) : [];
  
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy HH:mm:ss');
    } catch (e) {
      return timestamp;
    }
  };
  
  // Find the selected activity for reference
  
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center">
          <Activity className="h-6 w-6 mr-2 text-primary" />
          User Activity
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-md flex items-center transition-colors
            ${Object.keys(filters).length > 1 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
              : 'bg-muted text-foreground hover:bg-muted/80'}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters {Object.keys(filters).length > 1 && `(${Object.keys(filters).length - 1})`}
        </button>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-card rounded-lg shadow-sm p-4 mb-6 border border-border overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  User
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full p-2 pl-8 rounded-md border border-border bg-background text-foreground"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  
                  {userSearch && filteredUsers && filteredUsers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-card rounded-md shadow-lg border border-border max-h-48 overflow-y-auto">
                      {filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center"
                          onClick={() => {
                            handleFilterChange('userId', user.id);
                            setUserSearch('');
                          }}
                        >
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">{user.userName}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Activity Type
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                  className="w-full p-2 rounded-md border border-border bg-background text-foreground"
                >
                  <option value="">All Types</option>
                  {Object.keys(ActivityTypeColors).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  From Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.fromDate || ''}
                    onChange={(e) => handleFilterChange('fromDate', e.target.value || undefined)}
                    className="w-full p-2 pl-8 rounded-md border border-border bg-background text-foreground"
                  />
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  To Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.toDate || ''}
                    onChange={(e) => handleFilterChange('toDate', e.target.value || undefined)}
                    className="w-full p-2 pl-8 rounded-md border border-border bg-background text-foreground"
                  />
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={handleClearFilters}
                className="px-3 py-1.5 border border-border text-muted-foreground text-sm rounded-md hover:bg-muted transition-colors flex items-center"
              >
                <X className="h-3 w-3 mr-1" />
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          {activityData?.data && activityData.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Activity Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      IP Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {(activityData?.data ?? []).map((activity) => (
                    <tr 
                      key={activity.id}
                      className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                        selectedActivityId === activity.id ? 'bg-muted/50' : ''
                      }`}
                      onClick={() => setSelectedActivityId(
                        selectedActivityId === activity.id ? null : activity.id
                      )}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-foreground">{activity.userName}</div>
                            <div className="text-xs text-muted-foreground">{activity.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ActivityTypeColors[activity.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {activity.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          {formatTimestamp(activity.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {activity.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearActivity(activity.userId);
                            }}
                            className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
                            title="Clear user activity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No activity logs found</p>
              {Object.keys(filters).length > 1 && (
                <button
                  onClick={handleClearFilters}
                  className="mt-2 text-primary hover:underline"
                >
                  Clear filters and try again
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      <AnimatePresence>
        {selectedActivityId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/20"
            onClick={() => setSelectedActivityId(null)}
          >
            <div 
              className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-foreground">Activity Details</h3>
                <button
                  onClick={() => setSelectedActivityId(null)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {(() => {
                const selectedActivity = (activityData?.data ?? []).find((a: any) => a.id === selectedActivityId);
                if (!selectedActivity) {
                  return (
                    <div className="text-center p-4 text-muted-foreground">
                      <p>Activity not found</p>
                    </div>
                  );
                }
                
                // Display all activity data
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">User</p>
                        <p className="text-foreground">{selectedActivity.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Activity Type</p>
                        <span className={`px-2 py-1 text-xs rounded-full inline-block ${ActivityTypeColors[selectedActivity.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                          {selectedActivity.type}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Time</p>
                        <p className="text-foreground">{formatTimestamp(selectedActivity.timestamp)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                        <p className="text-foreground">{selectedActivity.ipAddress}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Activity Data</p>
                      {(() => {
                        try {
                          const data = selectedActivity.data ? JSON.parse(selectedActivity.data) : null;
                          if (!data || Object.keys(data).length === 0) {
                            return <p className="text-sm text-muted-foreground italic">No additional data available</p>;
                          }
                          return (
                            <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs text-foreground">
                              {JSON.stringify(data, null, 2)}
                            </pre>
                          );
                        } catch (error) {
                          return (
                            <div className="text-sm text-destructive p-3 bg-destructive/10 rounded-md">
                              <p className="font-medium">Error parsing activity data</p>
                              <p className="mt-1">{selectedActivity.data}</p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityLogs;