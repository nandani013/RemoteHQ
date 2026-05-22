import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Projects } from './pages/Projects';
import { Messages } from './pages/Messages';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient();

// A simple dummy component for routes not yet implemented
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-full">
    <h1 className="text-2xl text-muted-foreground">{title}</h1>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} /> {/* Using Login UI for demo */}
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="team" element={<Team />} />
            <Route path="projects" element={<Projects />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
