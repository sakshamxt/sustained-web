// src/pages/insights/IndiaHeatmapPage.jsx - UPDATED

import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Map, List, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import IndiaMap from '@/components/insights/IndiaMap';
import Tooltip from '@/components/common/Tooltip';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const IndiaHeatmapPage = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('map');

  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchHeatmapData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/insights/heatmap');
        let data = response.data?.heatmap || response.data || [];
        if (!Array.isArray(data)) data = [];
        setHeatmapData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch heatmap data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeatmapData();
  }, []);

  const dataByState = useMemo(() => {
    const map = {};
    heatmapData.forEach(item => { map[item.state] = item; });
    return map;
  }, [heatmapData]);

  const sortedData = useMemo(() => 
    [...heatmapData].sort((a, b) => b.count - a.count), 
  [heatmapData]);

  const colorScale = useMemo(() => {
    if (heatmapData.length === 0) return () => '#f1f5f9';
    const counts = heatmapData.map(d => d.count);
    const maxCount = Math.max(...counts);
    
    const startColor = { h: 210, s: 40, l: 90 };
    const endColor = { h: 221, s: 83, l: 53 };

    return (count) => {
      if (count === 0 || maxCount === 0) return '#f1f5f9';
      const ratio = Math.sqrt(count / maxCount);
      const h = startColor.h + (endColor.h - startColor.h) * ratio;
      const s = startColor.s + (endColor.s - startColor.s) * ratio;
      const l = startColor.l + (endColor.l - startColor.l) * ratio;
      return `hsl(${h}, ${s}%, ${l}%)`;
    };
  }, [heatmapData]);

  // --- THE FIX ---
  // The handleStateHover function now displays "Active Users" in the tooltip.
  const handleStateHover = (stateName, count, position) => {
    if (stateName) {
      setTooltipContent(
        <div>
          <p className="font-bold">{stateName}</p>
          <p>Active Users: {count.toLocaleString()}</p>
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
  if (error) return ( <div className="container py-8 mx-auto text-center"><Alert variant="destructive"><Info className="w-4 h-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert></div> );

  return (
    <div className="container py-8 mx-auto">
      <Tooltip content={tooltipContent} position={tooltipPosition} />
      <header className="py-12 mb-12 text-center border-b">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Community Heatmap
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-slate-600">
          Visualizing the learning activity and collective impact of the SustainED community across India.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        <main className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>State-wise Learning Activity</CardTitle>
                <CardDescription>Hover over a state or switch to table view for details.</CardDescription>
              </div>
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
                  <ToggleGroupItem value="map" aria-label="Toggle map view"><Map className="w-4 h-4"/></ToggleGroupItem>
                  <ToggleGroupItem value="table" aria-label="Toggle table view"><List className="w-4 h-4"/></ToggleGroupItem>
                </ToggleGroup>
            </CardHeader>
            <CardContent>
              {heatmapData.length === 0 ? (
                <div className="py-20 text-center text-slate-500">No heatmap data available.</div>
              ) : viewMode === 'map' ? (
                <IndiaMap data={dataByState} colorScale={colorScale} onStateHover={handleStateHover} onStateLeave={handleStateLeave} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Rank</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">Active Users</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.map((item, index) => (
                      <TableRow key={item.state}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.state}</TableCell>
                        <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>

        <aside className="lg:col-span-1 space-y-8 lg:sticky top-24 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Trophy className="w-5 h-5 mr-2 text-amber-500" /> Top 3 Active States</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {sortedData.slice(0, 3).map((item, index) => (
                  <li key={item.state} className="flex items-center justify-between">
                    <span className="font-medium">{index + 1}. {item.state}</span>
                    <span className="font-bold text-primary">{item.count.toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
          <Card>
             <CardHeader><CardTitle>Legend</CardTitle></CardHeader>
             <CardContent className="space-y-2">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{backgroundColor: colorScale(0)}}></div><span className="text-sm">Low Activity</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{backgroundColor: colorScale(Math.max(...heatmapData.map(d => d.count)) / 2)}}></div><span className="text-sm">Medium Activity</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{backgroundColor: colorScale(Math.max(...heatmapData.map(d => d.count)))}}></div><span className="text-sm">High Activity</span></div>
             </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default IndiaHeatmapPage;