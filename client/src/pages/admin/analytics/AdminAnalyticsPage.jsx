// src/pages/admin/analytics/AdminAnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Check, Activity } from 'lucide-react';

const AdminAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming API returns an object like: { totalUsers: 123, totalSdgs: 17, ... }
        const response = await apiClient.get('/admin/analytics/stats');
        setStats(response.data.stats || response.data || {});
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch site statistics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <p className="text-destructive">Error: {error}</p>;

  const statItems = [
    {
      title: "Total Users",
      value: stats.totalUsers ?? '--',
      icon: <Users className="w-6 h-6 text-muted-foreground" />,
      description: "Total registered users on the platform."
    },
    {
      title: "Total SDGs",
      value: stats.totalSdgs ?? '--',
      icon: <BookOpen className="w-6 h-6 text-muted-foreground" />,
      description: "Number of active SDG courses."
    },
    {
      title: "Total Completions",
      value: stats.totalCompletions ?? '--',
      icon: <Check className="w-6 h-6 text-muted-foreground" />,
      description: "Total content items marked as complete."
    },
    {
      title: "Active Users (24h)",
      value: stats.activeUsersToday ?? '--',
      icon: <Activity className="w-6 h-6 text-muted-foreground" />,
      description: "Users active in the last 24 hours."
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">Site Analytics</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <Card key={item.title} className="transition-shadow shadow-md hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-accent">{item.value}</div>
              <p className="pt-1 text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Add more charts or data visualizations here later */}
    </div>
  );
};

export default AdminAnalyticsPage;