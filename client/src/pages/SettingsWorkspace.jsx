import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/animations/framer';
import { Button } from '@/components/ui/Button';
import { User, Bell, Key, Shield, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Bell },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsWorkspace() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock states
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@insightpilot.com');
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  const handleGenerateKey = () => {
    toast.success('New API key generated: sk_test_' + Math.random().toString(36).substring(7));
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Profile Details</h3>
                  <p className="text-sm text-muted-foreground">Update your personal information.</p>
                </div>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <Button type="submit">Save Changes</Button>
              </form>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Appearance & Preferences</h3>
                  <p className="text-sm text-muted-foreground">Customize how InsightPilot looks on your device.</p>
                </div>
                
                <div className="flex items-center justify-between py-4 border-b border-border max-w-md">
                  <div>
                    <div className="font-medium">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Toggle dark theme appearance</div>
                  </div>
                  <button 
                    onClick={() => {
                      setDarkMode(!darkMode);
                      toast.success(darkMode ? "Switched to Light Mode" : "Switched to Dark Mode");
                    }}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      darkMode ? "bg-primary" : "bg-input"
                    )}
                  >
                    <span className={cn(
                      "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                      darkMode ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'api-keys' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">API Keys</h3>
                    <p className="text-sm text-muted-foreground">Manage keys for external integrations.</p>
                  </div>
                  <Button onClick={handleGenerateKey}>Generate New Key</Button>
                </div>
                
                <div className="border border-border rounded-lg divide-y divide-border">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm">sk_live_...98x2</div>
                      <div className="text-xs text-muted-foreground mt-1">Created on Oct 12, 2023</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Revoke</Button>
                  </div>
                  <div className="p-4 flex items-center justify-between bg-muted/5">
                    <div>
                      <div className="font-mono text-sm">sk_test_...4m9f</div>
                      <div className="text-xs text-muted-foreground mt-1">Created on Nov 4, 2023</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Revoke</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">Irreversible account actions.</p>
                </div>
                
                <div className="border border-destructive/20 rounded-lg p-4 bg-destructive/5 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-destructive">Delete Account</div>
                    <div className="text-sm text-muted-foreground mt-1 max-w-sm">
                      Permanently delete your account and remove access to all workspaces. This action cannot be undone.
                    </div>
                  </div>
                  <Button variant="destructive" onClick={() => toast.error("Cannot delete primary admin account.")}>
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
