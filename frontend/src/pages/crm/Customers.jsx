import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { crmApi } from '../../lib/api';
import { motion } from 'framer-motion';
import { UserCheck, Building, Mail, Phone, Calendar } from 'lucide-react';

export function Customers() {
  const { data: customers, isLoading, isError } = useQuery({ queryKey: ['customers'], queryFn: crmApi.getCustomers });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">People who have successfully closed deals.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading customers...</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">Error loading customers. Check DB connection.</div>
      ) : customers?.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No customers yet</h3>
          <p className="text-muted-foreground">Move a lead to WON to automatically create a customer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border shadow-sm p-6 hover:shadow-md transition-shadow group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building className="w-3 h-3" />
                    <span>{customer.company}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${customer.email}`} className="hover:text-primary transition-colors">{customer.email}</a>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${customer.phone}`} className="hover:text-primary transition-colors">{customer.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
