import { useState } from 'react';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Eye,
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Tabs } from '@/components/ui/Tabs';
import { NotificationType } from '@/types/notificationTypes';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
}

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const mockNotifications: Notification[] = [
    { 
      id: '1', 
      title: 'System Maintenance', 
      message: 'The system will be down for maintenance on Saturday from 2-4 AM UTC.', 
      type: NotificationType.SYSTEM, 
      date: '2023-12-10 14:30', 
      read: false 
    },
    { 
      id: '2', 
      title: 'New Feature Available', 
      message: 'We\'ve launched a new dashboard with improved analytics.', 
      type: NotificationType.FEATURE, 
      date: '2023-12-05 09:15', 
      read: true 
    },
    { 
      id: '3', 
      title: 'Account Security', 
      message: 'We recommend enabling two-factor authentication for better security.', 
      type: NotificationType.SECURITY, 
      date: '2023-12-01 11:45', 
      read: false 
    },
    { 
      id: '4', 
      title: 'Holiday Schedule', 
      message: 'Our offices will be closed during the upcoming holidays.', 
      type: NotificationType.ANNOUNCEMENT, 
      date: '2023-11-25 10:00', 
      read: true 
    },
    { 
      id: '5', 
      title: 'Password Expiry', 
      message: 'Your password will expire in 7 days. Please update it soon.', 
      type: NotificationType.SECURITY, 
      date: '2023-11-20 08:30', 
      read: false 
    },
    { 
      id: '6', 
      title: 'Survey Request', 
      message: 'Please take a moment to complete our user satisfaction survey.', 
      type: NotificationType.MARKETING, 
      date: '2023-11-15 13:20', 
      read: true 
    },
    { 
      id: '7', 
      title: 'API Deprecation', 
      message: 'The v1 API will be deprecated on January 15. Please migrate to v2.', 
      type: NotificationType.SYSTEM, 
      date: '2023-11-10 16:45', 
      read: true 
    },
  ];
  
  const getFilteredNotifications = (type: 'all' | 'unread' | 'read') => {
    let filtered = [...mockNotifications];
    
    if (type === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (type === 'read') {
      filtered = filtered.filter(n => n.read);
    }
    
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(notification => {
        return (
          notification.title.toLowerCase().includes(searchTermLower) ||
          notification.message.toLowerCase().includes(searchTermLower)
        );
      });
    }
    
    return filtered;
  };
  
  const allNotifications = getFilteredNotifications('all');
  const unreadNotifications = getFilteredNotifications('unread');
  const readNotifications = getFilteredNotifications('read');
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allNotifications.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = allNotifications.slice(indexOfFirstItem, indexOfLastItem);
  
  const getNotificationTypeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SYSTEM:
        return 'secondary';
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
  
  const markAllAsRead = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const renderNotificationList = (notifications: Notification[]) => {
    if (notifications.length === 0) {
      return (
        <div className="py-8 text-center text-muted-foreground">
          No notifications found
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`p-4 ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Badge variant={getNotificationTypeColor(notification.type)} className="mr-2">
                    {NotificationType[notification.type]}
                  </Badge>
                  {!notification.read && (
                    <span className="h-2 w-2 bg-primary rounded-full ml-2" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-foreground">{notification.title}</h3>
                <p className="text-muted-foreground mt-1">{notification.message}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {notification.date}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                {notification.read ? (
                  <Button variant="outline" size="sm">
                    <XCircle className="h-4 w-4 text-destructive" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  const tabsContent = [
    {
      id: 'all',
      label: `All (${allNotifications.length})`,
      content: renderNotificationList(currentNotifications)
    },
    {
      id: 'unread',
      label: `Unread (${unreadNotifications.length})`,
      content: renderNotificationList(unreadNotifications)
    },
    {
      id: 'read',
      label: `Read (${readNotifications.length})`,
      content: renderNotificationList(readNotifications)
    }
  ];
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Notifications</h1>
          <p className="text-muted-foreground mt-1">View and manage your notifications</p>
        </div>
        <Button
          variant="outline"
          className="mt-4 md:mt-0"
          onClick={markAllAsRead}
          isLoading={isLoading}
          disabled={isLoading}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark All as Read
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
      
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Notifications;