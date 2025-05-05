import { useState } from 'react';
import { 
  Save,
  User,
  Mail,
  Lock,
  Upload,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Shield,
  UserCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') {
      setShowPassword(!showPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  const handleUpdateProfile = () => {
    setIsLoading(true);
    setProfileSuccess(false);
    
    setTimeout(() => {
      setIsLoading(false);
      setProfileSuccess(true);
      
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  const handleChangePassword = () => {
    setIsLoading(true);
    setPasswordSuccess(false);
    
    setTimeout(() => {
      setIsLoading(false);
      setPasswordSuccess(true);
      
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  const personalInfoContent = (
    <div className="space-y-6">
      {profileSuccess && (
        <Alert variant="success" icon={<CheckCircle className="h-4 w-4" />}>
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-1/3 flex flex-col items-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {user?.userName ? (
                <span className="text-3xl font-bold text-primary">
                  {user.userName.charAt(0)}
                </span>
              ) : (
                <UserCircle className="h-20 w-20 text-primary" />
              )}
            </div>
            <button className="absolute bottom-4 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors">
              <Upload className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Recommended size: 256x256px
          </p>
        </div>
        
        <div className="sm:w-2/3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              defaultValue="John"
              icon={<User className="h-4 w-4 text-muted-foreground" />}
            />
            
            <Input
              label="Last Name"
              placeholder="Doe"
              defaultValue="Doe"
              icon={<User className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          <Input
            label="Email Address"
            placeholder="john@example.com"
            defaultValue={user?.email || 'admin@example.com'}
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          />
          
          <Input
            label="Username"
            placeholder="johndoe"
            defaultValue={user?.userName || 'admin'}
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Bio
            </label>
            <textarea 
              className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
              placeholder="Tell us about yourself"
              defaultValue="System administrator with 5+ years of experience."
            />
          </div>
          
          <Button
            variant="primary"
            onClick={handleUpdateProfile}
            isLoading={isLoading}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
  
  const securityContent = (
    <div className="space-y-6">
      {passwordSuccess && (
        <Alert variant="success" icon={<CheckCircle className="h-4 w-4" />}>
          <AlertDescription>Password changed successfully!</AlertDescription>
        </Alert>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4 text-muted-foreground" />}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Key className="h-4 w-4 text-muted-foreground" />}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Key className="h-4 w-4 text-muted-foreground" />}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Password Requirements:</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-emerald-500" />
                Minimum 8 characters
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-emerald-500" />
                At least one uppercase letter
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-emerald-500" />
                At least one lowercase letter
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-emerald-500" />
                At least one number
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-2 text-emerald-500" />
                At least one special character
              </li>
            </ul>
          </div>
          
          <Button
            variant="primary"
            onClick={handleChangePassword}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Change Password
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-foreground mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-foreground">Protect your account with 2FA</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.
              </p>
              <Button variant="outline" className="mt-3">
                Enable 2FA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const rolesContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Your Roles</h3>
        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <div className="flex flex-wrap gap-2">
            {user?.roles?.map((role, index) => (
          <Badge key={index} variant="default">{role}</Badge>
            )) || (
              <>
       <Badge variant="default">Admin</Badge>
                <Badge variant="secondary">Manager</Badge>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Permissions</h3>
        <Card className="p-4">
          <ul className="space-y-2">
            <li className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                <span className="text-foreground">View Dashboard</span>
              </div>
              <Badge variant="outline">User</Badge>
            </li>
            <li className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                <span className="text-foreground">Manage Users</span>
              </div>
              <Badge variant="outline">Admin</Badge>
            </li>
            <li className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                <span className="text-foreground">Send Notifications</span>
              </div>
              <Badge variant="outline">Manager</Badge>
            </li>
            <li className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                <span className="text-foreground">View Audit Logs</span>
              </div>
              <Badge variant="outline">Admin</Badge>
            </li>
            <li className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                <span className="text-foreground">Manage Roles</span>
              </div>
              <Badge variant="outline">Admin</Badge>
            </li>
          </ul>
        </Card>
      </div>
      
      <Alert variant="info" className="mt-4">
        <AlertDescription>
          Contact your system administrator if you need additional permissions.
        </AlertDescription>
      </Alert>
    </div>
  );
  
  const sessionsContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-border bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-primary/10 text-primary mr-3">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Current Session</h4>
                  <p className="text-xs text-muted-foreground">Windows • Chrome • 192.168.1.1</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
          <div className="p-4">
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Mac • Safari</p>
                  <p className="text-xs text-muted-foreground">Last active: 2 days ago • 173.45.22.98</p>
                </div>
                <Button variant="outline" size="sm">Revoke</Button>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">iPhone • Safari</p>
                  <p className="text-xs text-muted-foreground">Last active: 5 days ago • 95.142.76.32</p>
                </div>
                <Button variant="outline" size="sm">Revoke</Button>
              </li>
            </ul>
          </div>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Login History</h3>
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            <li className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Successful login</p>
                  <p className="text-xs text-muted-foreground">IP: 192.168.1.1 • Windows • Chrome</p>
                </div>
                <p className="text-xs text-muted-foreground">Today, 10:30 AM</p>
              </div>
            </li>
            <li className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Successful login</p>
                  <p className="text-xs text-muted-foreground">IP: 173.45.22.98 • Mac • Safari</p>
                </div>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </li>
            <li className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-destructive">Failed login attempt</p>
                  <p className="text-xs text-muted-foreground">IP: 84.22.105.67 • Unknown</p>
                </div>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </li>
            <li className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Successful login</p>
                  <p className="text-xs text-muted-foreground">IP: 95.142.76.32 • iPhone • Safari</p>
                </div>
                <p className="text-xs text-muted-foreground">5 days ago</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
      
      <Button variant="destructive" className="mt-4">
        <AlertTriangle className="h-4 w-4 mr-2" />
        Log out of all sessions
      </Button>
    </div>
  );
  
  const tabsContent = [
    {
      id: 'personal',
      label: 'Personal Info',
      content: personalInfoContent,
      icon: <User className="h-4 w-4 mr-2" />
    },
    {
      id: 'security',
      label: 'Security',
      content: securityContent,
      icon: <Lock className="h-4 w-4 mr-2" />
    },
    {
      id: 'roles',
      label: 'Roles & Permissions',
      content: rolesContent,
      icon: <Shield className="h-4 w-4 mr-2" />
    },
    {
      id: 'sessions',
      label: 'Sessions',
      content: sessionsContent,
      icon: <Key className="h-4 w-4 mr-2" />
    }
  ];
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>
      
      <Card className="overflow-hidden">
        <Tabs items={tabsContent} className="px-6 py-4" />
      </Card>
    </div>
  );
};

export default Profile;