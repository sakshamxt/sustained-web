// src/components/insights/IndiaMap.jsx - UPDATED

import React, { useState, useEffect } from 'react';
import { geoPath, geoMercator } from 'd3-geo';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const IndiaMap = ({ data, colorScale, onStateHover, onStateLeave }) => {
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/maps/in.json')
      .then(response => response.json())
      .then(geoJsonData => {
        setMapData(geoJsonData.features);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching map data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>;
  }
  
  if (!mapData) {
    return <div className="h-96 flex items-center justify-center text-red-500">Failed to load map data.</div>;
  }

  const projection = geoMercator()
    .center([82.8, 23.4])
    .scale(1000)
    .translate([300, 300]);

  const pathGenerator = geoPath().projection(projection);

  return (
    <svg 
        viewBox="0 0 600 600"
        className="w-full h-auto"
    >
      <g>
        {mapData.map((feature) => {
          const stateName = feature.properties.name;
          const stateData = stateName ? data[stateName] : undefined;
          const count = stateData ? stateData.count : 0;
          const fillColor = colorScale(count);

          return (
            <path
              key={feature.id}
              d={pathGenerator(feature)}
              fill={fillColor}
              strokeWidth="0.5"
              onMouseEnter={(e) => onStateHover(stateName, count, { x: e.clientX, y: e.clientY })}
              onMouseLeave={onStateLeave}
              onMouseMove={(e) => onStateHover(stateName, count, { x: e.clientX, y: e.clientY })}
              // --- UPDATED: Using a theme-aware class for the stroke color ---
              className="stroke-background transition-all duration-200 ease-in-out cursor-pointer hover:opacity-80"
            />
          );
        })}
      </g>
    </svg>
  );
};

export default IndiaMap;