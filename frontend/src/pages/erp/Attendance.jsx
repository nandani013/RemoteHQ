import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { erpApi } from '../../lib/erpApi';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, History } from 'lucide-react';

export function Attendance() {
  const queryClient = useQueryClient();
  const { data: attendance, isLoading } = useQuery({ queryKey: ['attendance'], queryFn: erpApi.getAttendance });
  
  // Using a dummy employee ID for demonstration since auth isn't fully implemented
  const DUMMY_EMP_ID = '00000000-0000-0000-0000-000000000000';

  const clockInMutation = useMutation({
    mutationFn: () => erpApi.clockIn(DUMMY_EMP_ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const clockOutMutation = useMutation({
    mutationFn: () => erpApi.clockOut(DUMMY_EMP_ID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const today = new Date().toISOString().split('T')[0];
  const activeRecord = attendance?.find(r => r.employeeId === DUMMY_EMP_ID && r.date === today && !r.clockOut);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time & Attendance</h1>
          <p className="text-muted-foreground mt-1">Track your daily working hours.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-2xl border shadow-sm p-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <Clock className="w-16 h-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {activeRecord ? 'Currently Clocked In' : 'Not Clocked In'}
          </h2>
          {activeRecord && (
             <p className="text-muted-foreground mb-6">Since {new Date(activeRecord.clockIn).toLocaleTimeString()}</p>
          )}

          <div className="flex gap-4 relative z-10">
            {!activeRecord ? (
              <button 
                onClick={() => clockInMutation.mutate()}
                disabled={clockInMutation.isPending}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50"
              >
                Clock In
              </button>
            ) : (
              <button 
                onClick={() => clockOutMutation.mutate()}
                disabled={clockOutMutation.isPending}
                className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
              >
                Clock Out
              </button>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Weekly Summary</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
               <span className="font-medium">Total Hours This Week</span>
               <span className="text-xl font-bold text-primary">32.5h</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
               <span className="font-medium">Average Daily Hours</span>
               <span className="text-xl font-bold">8.1h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6">Attendance History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Employee</th>
                <th className="pb-3 font-medium">Clock In</th>
                <th className="pb-3 font-medium">Clock Out</th>
                <th className="pb-3 font-medium text-right">Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="py-4 text-center text-muted-foreground">Loading history...</td></tr>
              ) : attendance?.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-muted-foreground">No attendance records found.</td></tr>
              ) : (
                attendance?.map((record) => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-4">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-4 font-medium">{record.employee?.name || 'Unknown'}</td>
                    <td className="py-4 text-emerald-500">
                      {new Date(record.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 text-red-500">
                      {record.clockOut ? new Date(record.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
                    </td>
                    <td className="py-4 text-right font-medium">
                      {record.totalHours ? `${record.totalHours.toFixed(1)}h` : '---'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
