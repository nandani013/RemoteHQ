import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CrmLayout } from './components/layout/CrmLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { CrmDashboard } from './pages/crm/CrmDashboard';
import { Leads } from './pages/crm/Leads';
import { Customers } from './pages/crm/Customers';
import { DealsPipeline } from './pages/crm/DealsPipeline';
import { SupportTickets } from './pages/crm/SupportTickets';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Messages } from './pages/Messages';
import { Settings } from './pages/Settings';
import SalesAutomation from './pages/crm/SalesAutomation';
import SalesAutomationDashboard from './pages/crm/SalesAutomationDashboard';
import PreCallSummary from './pages/crm/PreCallSummary';
import ConversationInsights from './pages/crm/ConversationInsights';
import TaskAutomation from './pages/crm/TaskAutomation';
import Recommendations from './pages/crm/Recommendations';
import EmailGenerator from './pages/crm/EmailGenerator';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          
          {/* CRM Module */}
          <Route path="/crm" element={<ProtectedRoute allowedRoles={['Client', 'Manager', 'Admin']} defaultRedirect="/" />}>
            <Route element={<CrmLayout />}>
              <Route index element={<CrmDashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="customers" element={<Customers />} />
              <Route path="deals" element={<DealsPipeline />} />
              <Route path="tickets" element={<SupportTickets />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="sales-automation" element={<SalesAutomation />}>
                <Route index element={<SalesAutomationDashboard />} />
                <Route path="pre-call-summary" element={<PreCallSummary />} />
                <Route path="conversation-insights" element={<ConversationInsights />} />
                <Route path="task-automation" element={<TaskAutomation />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="email-generator" element={<EmailGenerator />} />
              </Route>
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
