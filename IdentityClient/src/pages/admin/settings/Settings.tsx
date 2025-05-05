import { useState } from 'react';
import { 
  Save, 
  Settings as SettingsIcon, 
  Mail, 
  Bell, 
  Shield, 
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { toggleTheme } from '@/services/theme/themeSlice';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const generalSettingsContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Application Settings</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Application Name</h4>
              <p className="text-sm text-muted-foreground">The name displayed in the title bar and emails</p>
            </div>
            <Input className="max-w-xs" defaultValue="Admin Dashboard" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Default Language</h4>
              <p className="text-sm text-muted-foreground">Default language for the application</p>
            </div>
            <select className="h-10 max-w-xs w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Time Zone</h4>
              <p className="text-sm text-muted-foreground">Default time zone for dates and times</p>
            </div>
            <select className="h-10 max-w-xs w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0">
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="CST">CST (Central Standard Time)</option>
              <option value="PST">PST (Pacific Standard Time)</option>
              <option value="GMT">GMT (Greenwich Mean Time)</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Date Format</h4>
              <p className="text-sm text-muted-foreground">Format for displaying dates</p>
            </div>
            <select className="h-10 max-w-xs w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0">
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Appearance</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Dark Mode</h4>
              <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="dark-mode" className="text-sm text-muted-foreground mr-2">
                {isDark ? 'Enabled' : 'Disabled'}
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="dark-mode" 
                  className="sr-only peer" 
                  checked={isDark}
                  onChange={() => dispatch(toggleTheme())}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Sidebar Compact Mode</h4>
              <p className="text-sm text-muted-foreground">Reduce the width of the sidebar</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="sidebar-compact" className="text-sm text-muted-foreground mr-2">
                Disabled
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="sidebar-compact" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Primary Color</h4>
              <p className="text-sm text-muted-foreground">Select the primary color for the application</p>
            </div>
            <div className="flex space-x-2">
              <button className="h-8 w-8 rounded-full bg-blue-500 border-2 border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"></button>
              <button className="h-8 w-8 rounded-full bg-emerald-500 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"></button>
              <button className="h-8 w-8 rounded-full bg-violet-500 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"></button>
              <button className="h-8 w-8 rounded-full bg-amber-500 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"></button>
              <button className="h-8 w-8 rounded-full bg-rose-500 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const securitySettingsContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Authentication</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="2fa" className="text-sm text-muted-foreground mr-2">
                Disabled
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="2fa" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Password Expiration</h4>
              <p className="text-sm text-muted-foreground">Force password reset after a period of time</p>
            </div>
            <select className="h-10 max-w-xs w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0">
              <option value="never">Never</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Session Timeout</h4>
              <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
            </div>
            <select className="h-10 max-w-xs w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Failed Login Attempts</h4>
              <p className="text-sm text-muted-foreground">Lock account after failed login attempts</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0">
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="0">Disable</option>
              </select>
              <span className="text-sm text-muted-foreground">attempts</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">IP Restrictions</h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-foreground">IP Whitelisting</h4>
              <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="ip-whitelist" className="text-sm text-muted-foreground mr-2">
                Disabled
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="ip-whitelist" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <textarea 
            className="w-full h-24 p-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            placeholder="Enter IP addresses, one per line"
            disabled
          ></textarea>
          <p className="text-xs text-muted-foreground">Enter one IP address per line. CIDR notation is supported. Example: 192.168.1.0/24</p>
        </div>
      </div>
    </div>
  );
  
  const notificationSettingsContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">New User Registration</h4>
              <p className="text-sm text-muted-foreground">Send email when a new user registers</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="new-user-email" className="text-sm text-muted-foreground mr-2">
                Enabled
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="new-user-email" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Password Reset</h4>
              <p className="text-sm text-muted-foreground">Send email for password reset requests</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="password-reset-email" className="text-sm text-muted-foreground mr-2">
                Enabled
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="password-reset-email" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Account Lockout</h4>
              <p className="text-sm text-muted-foreground">Send email when an account is locked</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="account-lockout-email" className="text-sm text-muted-foreground mr-2">
                Enabled
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="account-lockout-email" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">System Notifications</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">System Updates</h4>
              <p className="text-sm text-muted-foreground">Send notifications for system updates</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="system-updates" className="text-sm text-muted-foreground mr-2">
                Enabled
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="system-updates" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Maintenance Alerts</h4>
              <p className="text-sm text-muted-foreground">Send notifications for scheduled maintenance</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="maintenance-alerts" className="text-sm text-muted-foreground mr-2">
                Enabled
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="maintenance-alerts" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Security Alerts</h4>
              <p className="text-sm text-muted-foreground">Send notifications for security issues</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="security-alerts" className="text-sm text-muted-foreground mr-2">
                Enabled
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="security-alerts" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const emailSettingsContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">SMTP Configuration</h3>
        <div className="grid gap-4">
          <Input
            label="SMTP Server"
            placeholder="smtp.example.com"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="SMTP Port"
              placeholder="587"
              type="number"
            />
            
            <select 
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 mt-7"
              aria-label="Encryption Type"
            >
              <option value="">Select Encryption</option>
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
              <option value="none">None</option>
            </select>
          </div>
          
          <Input
            label="SMTP Username"
            placeholder="username@example.com"
          />
          
          <Input
            label="SMTP Password"
            type="password"
            placeholder="••••••••"
          />
          
          <div className="flex items-center">
            <input
              id="smtp-auth"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              defaultChecked
            />
            <label htmlFor="smtp-auth" className="ml-2 block text-sm text-foreground">
              SMTP Authentication
            </label>
          </div>
          
          <Button variant="outline" className="w-fit">
            Test Connection
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Default Settings</h3>
        <div className="grid gap-4">
          <Input
            label="From Email"
            placeholder="noreply@example.com"
          />
          
          <Input
            label="From Name"
            placeholder="Admin Dashboard"
          />
          
          <div className="flex items-center">
            <input
              id="email-footer"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              defaultChecked
            />
            <label htmlFor="email-footer" className="ml-2 block text-sm text-foreground">
              Include Default Footer
            </label>
          </div>
        </div>
      </div>
    </div>
  );
  
  const tabsContent = [
    {
      id: 'general',
      label: 'General',
      content: generalSettingsContent,
      icon: <SettingsIcon className="h-4 w-4 mr-2" />
    },
    {
      id: 'security',
      label: 'Security',
      content: securitySettingsContent,
      icon: <Shield className="h-4 w-4 mr-2" />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: notificationSettingsContent,
      icon: <Bell className="h-4 w-4 mr-2" />
    },
    {
      id: 'email',
      label: 'Email',
      content: emailSettingsContent,
      icon: <Mail className="h-4 w-4 mr-2" />
    }
  ];
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage system settings and configurations</p>
        </div>
        <Button
          variant="primary"
          className="mt-4 md:mt-0"
          onClick={handleSaveSettings}
          isLoading={isLoading}
          disabled={isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <Tabs items={tabsContent} className="px-6 py-4" />
      </Card>
    </div>
  );
};

export default Settings;