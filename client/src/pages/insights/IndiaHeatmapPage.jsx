// src/pages/insights/IndiaHeatmapPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, MapPin, Activity } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const IndiaHeatmapPage = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalActivity, setTotalActivity] = useState(0);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/insights/heatmap');
        // Assuming API returns an array of objects: e.g., [{ state: "State Name", count: 123, coordinates: {...} }, ...]
        const data = response.data.heatmap || response.data || [];
        setHeatmapData(data);
        // Calculate total activity
        const total = data.reduce((sum, item) => sum + (item.count || 0), 0);
        setTotalActivity(total);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch heatmap data.');
        console.error("Fetch Heatmap Data error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeatmapData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="container py-8 mx-auto text-center">
         <Alert variant="destructive" className="max-w-lg mx-auto">
          <Info className="w-4 h-4" />
          <AlertTitle>Error Fetching Heatmap Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          India Learning Activity Heatmap
        </h1>
        <p className="mt-2 text-muted-foreground">
          Activity distribution across different states in India.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-primary" />
            State-wise Learning Activity
          </CardTitle>
          <CardDescription>
            Total recorded learning activities: <strong className="text-brand-accent">{totalActivity}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {heatmapData.length === 0 ? (
             <div className="py-10 text-center text-muted-foreground">No heatmap data available at the moment.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Activity Count</TableHead>
                  <TableHead className="text-right w-[150px]">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heatmapData
                  .sort((a, b) => (b.count || 0) - (a.count || 0)) // Sort by count descending
                  .map((item, index) => (
                  <TableRow key={item.state || index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item.state || 'Unknown State'}</TableCell>
                    <TableCell className="font-semibold text-right text-brand-accent">
                      {item.count !== undefined ? item.count : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {totalActivity > 0 && item.count !== undefined
                        ? `${((item.count / totalActivity) * 100).toFixed(1)}%`
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {heatmapData.length > 5 && (
                <TableCaption>A summary of learning activities across states.</TableCaption>
              )}
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IndiaHeatmapPage;