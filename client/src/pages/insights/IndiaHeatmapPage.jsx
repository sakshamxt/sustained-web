// src/pages/insights/IndiaHeatmapPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import IndiaMap from '@/components/insights/IndiaMap'; // Import the new map component
import Tooltip from '@/components/common/Tooltip'; // Import the new tooltip component
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // For Map/Table toggle

const IndiaHeatmapPage = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'table'

  // Tooltip State
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchHeatmapData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/insights/heatmap');
        setHeatmapData(response.data.heatmap || response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch heatmap data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeatmapData();
  }, []);

  // Process data for easy lookup by state name
  const dataByState = useMemo(() => {
    const map = {};
    heatmapData.forEach(item => {
      map[item.state] = item;
    });
    return map;
  }, [heatmapData]);

  // Color scale logic
  const colorScale = useMemo(() => {
    if (heatmapData.length === 0) return () => '#E2E8F0'; // Default gray color
    
    const counts = heatmapData.map(d => d.count);
    const maxCount = Math.max(...counts);
    
    // HSL values for our color scale (light teal to dark/brand teal)
    const startColor = { h: 165, s: 60, l: 85 }; // Very light teal
    const endColor = { h: 173, s: 80, l: 30 }; // Our primary brand teal

    return (count) => {
      if (count === 0 || maxCount === 0) return '#E2E8F0'; // Return default gray for 0
      const ratio = count / maxCount;
      const h = startColor.h + (endColor.h - startColor.h) * ratio;
      const s = startColor.s + (endColor.s - startColor.s) * ratio;
      const l = startColor.l + (endColor.l - startColor.l) * ratio;
      return `hsl(${h}, ${s}%, ${l}%)`;
    };
  }, [heatmapData]);

  // Tooltip handlers
  const handleStateHover = (stateName, count, position) => {
    if (stateName) {
      setTooltipContent(
        <div>
          <p className="font-bold">{stateName}</p>
          <p>Activities: {count}</p>
        </div>
      );
      setTooltipPosition(position);
    } else {
      setTooltipContent('');
    }
  };

  const handleStateLeave = () => {
    setTooltipContent('');
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <div className="container py-8 mx-auto text-center"><Alert variant="destructive"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div>;

  return (
    <div className="container py-8 mx-auto">
      <Tooltip content={tooltipContent} position={tooltipPosition} />
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">India Learning Activity Heatmap</h1>
        <p className="mt-2 text-muted-foreground">Activity distribution across different states in India.</p>
      </header>

      <div className="flex justify-center mb-6">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
          <ToggleGroupItem value="map" aria-label="Toggle map view">Map View</ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Toggle table view">Table View</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><MapPin className="w-6 h-6 mr-2 text-primary" /> State-wise Learning Activity</CardTitle>
          <CardDescription>Hover over a state on the map for details.</CardDescription>
        </CardHeader>
        <CardContent>
          {heatmapData.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">No heatmap data available.</div>
          ) : (
            viewMode === 'map' ? (
              <IndiaMap 
                data={dataByState} 
                colorScale={colorScale} 
                onStateHover={handleStateHover}
                onStateLeave={handleStateLeave}
              />
            ) : (
                // You can reuse the table from Step 5.3 here if you want
                <p className="p-4 text-center">Table view would be displayed here.</p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IndiaHeatmapPage;