// src/pages/admin/AdminDashboardPage.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const AdminDashboardPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        {/* Add any header actions here if needed */}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-brand-accent" />
            Welcome, Admin!
          </CardTitle>
          <CardDescription>Overview of the SDG Learning Platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the main dashboard for site administration. Key metrics and quick actions will appear here.</p>
          {/* Placeholder for admin widgets/stats */}
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Example Stat Cards */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Total Users</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">--</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Active SDGs</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">--</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Completions Today</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">--</p></CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;