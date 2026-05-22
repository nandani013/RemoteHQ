import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, PaintBucket, CreditCard, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import useAuthStore from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export function Settings() {
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Local state for profile form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      updateUser({ name, email });
      setIsSaving(false);
    }, 600);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: PaintBucket },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card border border-border rounded-xl p-6 shadow-sm min-h-[500px]">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Profile</h3>
                <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
              </div>
              <div className="border-t border-border pt-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-xl font-bold text-primary">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'J'}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="h-9">Change avatar</Button>
                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>
                <div className="grid gap-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Jane Doe" 
                      className="bg-background" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="jane@example.com" 
                      className="bg-background" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                      placeholder="Tell us a little bit about yourself"
                    ></textarea>
                  </div>
                </div>
                <Button 
                  onClick={handleSaveProfile} 
                  isLoading={isSaving}
                  className="flex items-center gap-2"
                >
                  {!isSaving && <Save size={16} />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize the look and feel of your workspace.</p>
              </div>
              <div className="border-t border-border pt-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Theme</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                    >
                      <div className="h-20 bg-white border border-gray-200 rounded-md mb-3 flex flex-col p-2 gap-1.5 shadow-sm">
                        <div className="h-3 w-full bg-gray-100 rounded-sm"></div>
                        <div className="h-10 w-full bg-gray-50 rounded-sm border border-gray-100"></div>
                      </div>
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}
                    >
                      <div className="h-20 bg-zinc-950 border border-zinc-800 rounded-md mb-3 flex flex-col p-2 gap-1.5 shadow-sm">
                        <div className="h-3 w-full bg-zinc-900 rounded-sm"></div>
                        <div className="h-10 w-full bg-zinc-900 rounded-sm border border-zinc-800"></div>
                      </div>
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">Choose what you want to be notified about.</p>
              </div>
              <div className="border-t border-border pt-6 space-y-6">
                {[
                  { title: 'Email Notifications', desc: 'Receive daily summaries and important updates.' },
                  { title: 'Push Notifications', desc: 'Get instant alerts when someone mentions you.' },
                  { title: 'Marketing Emails', desc: 'Receive news, special offers, and product updates.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div className="space-y-0.5 pr-4">
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dummy placeholders for remaining tabs */}
          {['security', 'billing'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
              <Shield size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium text-foreground">Advanced settings</p>
              <p className="text-sm text-center max-w-sm mt-2">These sections would integrate with your identity provider and payment gateway.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
