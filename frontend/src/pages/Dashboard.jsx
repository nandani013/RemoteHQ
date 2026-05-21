import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CheckCircle2, Circle, Clock, MoreHorizontal, Video, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { KPICards } from '../components/dashboard/KPICards';

// --- MOCK DATA ---

const areaData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 800 },
  { name: 'Apr', total: 1600 },
  { name: 'May', total: 900 },
  { name: 'Jun', total: 1700 },
  { name: 'Jul', total: 3200 },
];

const barData = [
  { name: 'Mon', active: 400, inactive: 240 },
  { name: 'Tue', active: 300, inactive: 139 },
  { name: 'Wed', active: 200, inactive: 980 },
  { name: 'Thu', active: 278, inactive: 390 },
  { name: 'Fri', active: 189, inactive: 480 },
  { name: 'Sat', active: 239, inactive: 380 },
  { name: 'Sun', active: 349, inactive: 430 },
];

const recentTasks = [
  { id: 1, title: 'Update onboarding flow', project: 'Design System', status: 'completed', time: '2h ago' },
  { id: 2, title: 'Fix navigation bug', project: 'Web App', status: 'pending', time: 'Today' },
  { id: 3, title: 'Prepare Q3 Report', project: 'Management', status: 'pending', time: 'Tomorrow' },
  { id: 4, title: 'Review PR #412', project: 'Web App', status: 'completed', time: '1d ago' },
];

const teamActivity = [
  { id: 1, user: 'Sarah Jenkins', action: 'pushed to', target: 'main', project: 'Web App', time: '10m ago', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 2, user: 'Marcus Chen', action: 'commented on', target: 'PR #412', project: 'Web App', time: '1h ago', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 3, user: 'Elena Rodriguez', action: 'completed task', target: 'New Logo Design', project: 'Branding', time: '3h ago', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: 4, user: 'David Kim', action: 'created', target: 'Q3 Road Map', project: 'Strategy', time: '5h ago', avatar: 'https://i.pravatar.cc/150?u=david' },
];

const upcomingMeetings = [
  { id: 1, title: 'Product Sync', time: '10:00 AM', duration: '45m', attendees: 5, isVideo: true },
  { id: 2, title: 'Design Review', time: '1:30 PM', duration: '1h', attendees: 3, isVideo: true },
  { id: 3, title: '1:1 with Sarah', time: '3:00 PM', duration: '30m', attendees: 2, isVideo: false },
];

// --- ANIMATION VARIANTS ---

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function Dashboard() {
  return (
    <motion.div 
      className="space-y-6 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your projects today.</p>
      </div>

      {/* KPI Cards — extracted component */}
      <KPICards itemVariants={itemVariants} />

      {/* Main Charts Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <GlassCard className="h-[400px] flex flex-col p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
              <p className="text-sm text-muted-foreground">Monthly revenue breakdown for the current year</p>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <GlassCard className="h-[400px] flex flex-col p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">User Activity</h3>
              <p className="text-sm text-muted-foreground">Weekly active vs inactive users</p>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--accent))'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="active" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="inactive" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Widgets Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Team Activity Feed */}
        <motion.div variants={itemVariants} className="col-span-1">
          <GlassCard className="h-full flex flex-col">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-border/30">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Team Activity</h3>
                <p className="text-sm text-muted-foreground">Latest actions from your team</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-border/30">
                {teamActivity.map((activity) => (
                  <div key={activity.id} className="p-4 flex gap-3 hover:bg-muted/20 transition-colors">
                    <img src={activity.avatar} alt={activity.user} className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-border/30" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        <span className="font-medium text-foreground">{activity.target}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{activity.project}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Tasks */}
        <motion.div variants={itemVariants} className="col-span-1">
          <GlassCard className="h-full flex flex-col">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-border/30">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recent Tasks</h3>
                <p className="text-sm text-muted-foreground">Your assigned tasks for today</p>
              </div>
              <button className="text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="flex-1 p-4 space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/30 bg-background/50 hover:border-primary/50 transition-colors">
                  <div className="mt-0.5 shrink-0">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", task.status === 'completed' && "line-through text-muted-foreground")}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {task.time}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Upcoming Meetings */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-1">
          <GlassCard className="h-full flex flex-col">
            <div className="flex justify-between items-center p-6 pb-4 border-b border-border/30">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Schedule</h3>
                <p className="text-sm text-muted-foreground">Upcoming meetings</p>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex gap-4 p-4 rounded-lg bg-muted/20 border border-transparent hover:border-border/30 transition-colors">
                  <div className="flex flex-col items-center justify-center shrink-0 w-14">
                    <span className="text-xs font-semibold text-primary">{meeting.time.split(' ')[0]}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{meeting.time.split(' ')[1]}</span>
                  </div>
                  <div className="w-px bg-border/30"></div>
                  <div className="flex-1 min-w-0 py-1">
                    <p className="text-sm font-medium text-foreground truncate">{meeting.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meeting.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {meeting.attendees}</span>
                      {meeting.isVideo && <span className="flex items-center gap-1 text-primary"><Video className="w-3 h-3" /> Link</span>}
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 mt-2 border border-dashed border-border/30 rounded-lg text-sm text-muted-foreground hover:bg-muted/20 hover:text-foreground transition-colors flex items-center justify-center gap-2">
                <Circle className="w-4 h-4" /> Schedule Meeting
              </button>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </motion.div>
  );
}
