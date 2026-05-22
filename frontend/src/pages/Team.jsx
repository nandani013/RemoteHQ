import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Mail, MoreHorizontal, Shield } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const teamMembers = [
  { id: 1, name: 'Elena Rodriguez', role: 'Engineering Lead', email: 'elena@remotehq.com', status: 'Online', avatar: 'https://i.pravatar.cc/150?u=elena', dept: 'Engineering' },
  { id: 2, name: 'Marcus Chen', role: 'Senior Designer', email: 'marcus@remotehq.com', status: 'In a meeting', avatar: 'https://i.pravatar.cc/150?u=marcus', dept: 'Design' },
  { id: 3, name: 'Sarah Jenkins', role: 'Product Manager', email: 'sarah@remotehq.com', status: 'Offline', avatar: 'https://i.pravatar.cc/150?u=sarah', dept: 'Product' },
  { id: 4, name: 'David Kim', role: 'Backend Engineer', email: 'david@remotehq.com', status: 'Online', avatar: 'https://i.pravatar.cc/150?u=david', dept: 'Engineering' },
  { id: 5, name: 'Anita Patel', role: 'UX Researcher', email: 'anita@remotehq.com', status: 'Online', avatar: 'https://i.pravatar.cc/150?u=anita', dept: 'Design' },
  { id: 6, name: 'James Wilson', role: 'DevOps Engineer', email: 'james@remotehq.com', status: 'Busy', avatar: 'https://i.pravatar.cc/150?u=james', dept: 'Engineering' },
];

export function Team() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeam = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Team Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your team members and their account permissions here.</p>
        </div>
        <Button className="shrink-0 flex items-center gap-2">
          <UserPlus size={16} />
          Invite Member
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card border border-border p-3 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search team members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-background"
          />
        </div>
        <div className="hidden sm:flex gap-2">
          <span className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full cursor-pointer hover:bg-primary/20 transition-colors">All</span>
          <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded-full cursor-pointer transition-colors">Engineering</span>
          <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded-full cursor-pointer transition-colors">Design</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={member.id} 
            className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full border-2 border-background shadow-sm" />
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                  member.status === 'Online' ? 'bg-emerald-500' : 
                  member.status === 'Busy' || member.status === 'In a meeting' ? 'bg-amber-500' : 'bg-zinc-400'
                }`}></span>
              </div>
              <button className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-colors opacity-0 group-hover:opacity-100">
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <div className="space-y-1 mb-4">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-primary font-medium">{member.role}</p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield size={14} />
                <span>{member.dept} Dept</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex gap-2">
              <Button variant="outline" className="flex-1 text-xs h-8">View Profile</Button>
              <Button variant="ghost" className="flex-1 text-xs h-8 text-primary hover:text-primary hover:bg-primary/10">Message</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
