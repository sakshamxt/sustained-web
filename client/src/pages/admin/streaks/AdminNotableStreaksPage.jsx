// src/pages/admin/streaks/AdminNotableStreaksPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Zap, Star } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming you create a debounce hook




const AdminNotableStreaksPage = () => {
  const [streaks, setStreaks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(10); // Default threshold

  // For simplicity without a custom hook, we'll use a simple setTimeout for debounce
  useEffect(() => {
    const fetchNotableStreaks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // GET /api/community/streaks/notable?threshold=...
        const response = await apiClient.get('/community/streaks/notable', {
          params: { threshold }
        });
        setStreaks(response.data.streaks || response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch notable streaks.');
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce logic
    const handler = setTimeout(() => {
        if(threshold > 0) {
            fetchNotableStreaks();
        } else {
            setStreaks([]);
            setIsLoading(false);
        }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };

  }, [threshold]); // Re-run effect when threshold changes (after debounce)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center text-3xl font-bold text-primary">
            <Zap className="w-8 h-8 mr-3 text-brand-accent"/> Notable Streaks
        </h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>View Users with High Streaks</CardTitle>
          <CardDescription>Enter a minimum streak value to filter users.</CardDescription>
          <div className="pt-4">
            <Label htmlFor="threshold" className="text-sm font-medium">Streak Threshold</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              placeholder="e.g., 10"
              className="max-w-xs mt-1"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <LoadingSpinner /> : error ? <p className="text-destructive">Error: {error}</p> : (
            <Table>
              <TableCaption>{streaks.length > 0 ? "Users matching the streak threshold." : "No users found for this threshold."}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-center">Current Streak</TableHead>
                  <TableHead className="text-right">Total Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {streaks.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell className="font-bold text-center text-primary">{user.streak} days</TableCell>
                    <TableCell className="text-right text-muted-foreground">{user.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotableStreaksPage;