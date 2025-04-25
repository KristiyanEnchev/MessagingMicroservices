import { useState, useEffect } from 'react';
import { 
  BarChart, 
  User, 
  Bell, 
  FileText,
  Clock,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(4);
  const [documents, setDocuments] = useState(12);
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: 'Weekly Meeting', date: '2025-04-15T10:00:00', type: 'meeting' },
    { id: 2, title: 'Project Deadline', date: '2025-04-18T17:00:00', type: 'deadline' },
    { id: 3, title: 'Review Session', date: '2025-04-20T14:30:00', type: 'meeting' },
  ]);
  
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'document', title: 'Annual Report.pdf', date: '2025-04-11T08:30:00' },
    { id: 2, type: 'message', title: 'Chat with Support', date: '2025-04-10T15:45:00' },
    { id: 3, type: 'login', title: 'System Login', date: '2025-04-10T09:15:00' },
    { id: 4, type: 'document', title: 'Contract Draft.docx', date: '2025-04-09T11:20:00' },
  ]);
  
  const ActivityIcon = ({ type }: { type: string }) => {
    switch(type) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <Bell className="h-4 w-4 text-green-500" />;
      case 'login':
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center mb-6">
        <BarChart className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Client Dashboard</h1>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Welcome back, {user?.userName || 'User'}</h2>
          <p className="text-muted-foreground">
            This is your personal dashboard where you can monitor your activity, manage documents,
            and check upcoming events.
          </p>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg shadow-sm p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-foreground">Notifications</h3>
            <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{notifications}</div>
          <p className="text-sm text-muted-foreground mt-1">Unread notifications</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg shadow-sm p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-foreground">Documents</h3>
            <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{documents}</div>
          <p className="text-sm text-muted-foreground mt-1">Total documents</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg shadow-sm p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-foreground">Profile</h3>
            <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="text-base font-medium text-foreground">{user?.email || 'user@example.com'}</div>
          <p className="text-sm text-muted-foreground mt-1">Your account</p>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-lg shadow-sm p-6 border border-border"
        >
          <h3 className="text-base font-medium text-foreground mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-start p-3 bg-background rounded-md border border-border">
                <div className={`h-10 w-10 rounded-md flex items-center justify-center mr-3 ${
                  event.type === 'meeting' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                  'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                }`}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(event.date)} at {formatTime(event.date)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-lg shadow-sm p-6 border border-border"
        >
          <h3 className="text-base font-medium text-foreground mb-4 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-2">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center p-2 hover:bg-muted/50 rounded-md transition-colors">
                <div className="h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center mr-3">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(activity.date)}, {formatTime(activity.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;