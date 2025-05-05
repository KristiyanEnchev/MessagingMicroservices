import { useState } from 'react';
import { 
  Search, 
  Filter,
  PlusCircle, 
  Bell,
  Users,
  Send,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { NotificationType } from '@/types/notificationTypes';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipients: number;
  sentAt: string;
  sentBy: string;
  status: 'sent' | 'scheduled' | 'draft' | 'failed';
}

const NotificationManagement = () => {
  const [isLoading, _setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const mockNotifications: Notification[] = [
    { 
      id: '1', 
      title: 'System Maintenance', 
      message: 'The system will be down for maintenance on Saturday from 2-4 AM UTC.', 
      type: NotificationType.SYSTEM, 
      recipients: 325, 
      sentAt: '2023-12-10 14:30', 
      sentBy: 'System Admin',
      status: 'sent' 
    },
    { 
      id: '2', 
      title: 'New Feature Available', 
      message: 'We\'ve launched a new dashboard with improved analytics.', 
      type: NotificationType.FEATURE, 
      recipients: 450, 
      sentAt: '2023-12-05 09:15', 
      sentBy: 'Product Manager',
      status: 'sent' 
    },
    { 
      id: '3', 
      title: 'Account Security', 
      message: 'We recommend enabling two-factor authentication for better security.', 
      type: NotificationType.SECURITY, 
      recipients: 156, 
      sentAt: '2023-12-01 11:45', 
      sentBy: 'Security Team',
      status: 'sent' 
    },
    { 
      id: '4', 
      title: 'Holiday Schedule', 
      message: 'Our offices will be closed during the upcoming holidays.', 
      type: NotificationType.ANNOUNCEMENT, 
      recipients: 500, 
      sentAt: '2023-11-25 10:00', 
      sentBy: 'HR Department',
      status: 'sent' 
    },
    { 
      id: '5', 
      title: 'Password Expiry', 
      message: 'Your password will expire in 7 days. Please update it soon.', 
      type: NotificationType.SECURITY, 
      recipients: 25, 
      sentAt: '2023-11-20 08:30', 
      sentBy: 'System Admin',
      status: 'scheduled' 
    },
    { 
      id: '6', 
      title: 'Survey Request', 
      message: 'Please take a moment to complete our user satisfaction survey.', 
      type: NotificationType.MARKETING, 
      recipients: 300, 
      sentAt: '2023-11-15 13:20', 
      sentBy: 'Marketing Team',
      status: 'draft' 
    },
    { 
      id: '7', 
      title: 'API Deprecation', 
      message: 'The v1 API will be deprecated on January 15. Please migrate to v2.', 
      type: NotificationType.SYSTEM, 
      recipients: 120, 
      sentAt: '2023-11-10 16:45', 
      sentBy: 'Development Team',
      status: 'failed' 
    },
  ];
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="h-4 w-4 ml-1" /> : 
      <ArrowDown className="h-4 w-4 ml-1" />;
  };
  
  const sortedNotifications = [...mockNotifications].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA, valueB;
    
    if (sortField === 'title') {
      valueA = a.title;
      valueB = b.title;
    } else if (sortField === 'type') {
      valueA = a.type;
      valueB = b.type;
    } else if (sortField === 'recipients') {
      valueA = a.recipients;
      valueB = b.recipients;
    } else if (sortField === 'sentAt') {
      valueA = a.sentAt;
      valueB = b.sentAt;
    } else {
      return 0;
    }
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    } else {
      return sortDirection === 'asc'
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    }
  });
  
  const filteredNotifications = sortedNotifications.filter(notification => {
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchTermLower) ||
        notification.message.toLowerCase().includes(searchTermLower) ||
        notification.type.toString().toLowerCase().includes(searchTermLower) ||
        notification.sentBy.toLowerCase().includes(searchTermLower)
      );
    }
    return true;
  });
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  
  const getNotificationTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM:
        return 'default';
      case NotificationType.SECURITY:
        return 'destructive';
      case NotificationType.FEATURE:
        return 'success';
      case NotificationType.MARKETING:
        return 'info';
      case NotificationType.ANNOUNCEMENT:
        return 'warning';
      default:
        return 'secondary';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'draft':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  const tabsContent = [
    {
      id: 'all',
      label: 'All Notifications',
      content: (
        <div className="mt-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Title {getSortIcon('title')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center">
                        Type {getSortIcon('type')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('recipients')}
                    >
                      <div className="flex items-center">
                        Recipients {getSortIcon('recipients')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('sentAt')}
                    >
                      <div className="flex items-center">
                        Date {getSortIcon('sentAt')}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : currentNotifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No notifications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{notification.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {notification.message}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getNotificationTypeColor(notification.type)}>
                            {NotificationType[notification.type]}
                          </Badge>
                        </TableCell>
                        <TableCell>{notification.recipients}</TableCell>
                        <TableCell>{notification.sentAt}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(notification.status)}>
                            {notification.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{notification.sentBy}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between border-t border-border p-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredNotifications.length)}
                </span>{' '}
                of <span className="font-medium">{filteredNotifications.length}</span> notifications
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'templates',
      label: 'Templates',
      content: (
        <div className="p-4 text-center text-muted-foreground">
          Notification templates will be displayed here.
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <div className="p-4 text-center text-muted-foreground">
          Notification settings will be displayed here.
        </div>
      )
    }
  ];
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notification Management</h1>
          <p className="text-muted-foreground mt-1">Manage and send notifications to users</p>
        </div>
        <Button
          variant="primary"
          className="mt-4 md:mt-0"
          onClick={() => setIsSendNotificationOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>
      
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>
      
      <Tabs items={tabsContent} />
      
      <Dialog
        isOpen={isSendNotificationOpen}
        onClose={() => setIsSendNotificationOpen(false)}
        title="Send Notification"
        description="Create and send a notification to users."
      >
        <form className="space-y-4 mt-4">
          <Input
            label="Title"
            placeholder="Enter notification title"
            icon={<Bell className="h-4 w-4 text-muted-foreground" />}
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Message
            </label>
            <textarea 
              className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
              placeholder="Enter notification message"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Notification Type"
              options={[
                { value: '0', label: 'System' },
                { value: '1', label: 'Security' },
                { value: '2', label: 'Feature' },
                { value: '3', label: 'Marketing' },
                { value: '4', label: 'Announcement' }
              ]}
            />
            
            <Select
              label="Recipients"
              options={[
                { value: 'all', label: 'All Users' },
                { value: 'admin', label: 'Admins Only' },
                { value: 'active', label: 'Active Users' },
                { value: 'new', label: 'New Users' }
              ]}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="schedule"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="schedule" className="text-sm text-foreground">
              Schedule for later
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsSendNotificationOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary">
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default NotificationManagement;