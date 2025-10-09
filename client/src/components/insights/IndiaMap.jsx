// src/components/insights/IndiaMap.jsx - FINAL, FUNCTIONAL VERSION

import React, { useState, useEffect } from 'react';
import { geoPath, geoMercator } from 'd3-geo'; // You would use this in a real project
import LoadingSpinner from '@/components/common/LoadingSpinner';

// This component now fetches and renders the map from your in.json file
const IndiaMap = ({ data, colorScale, onStateHover, onStateLeave }) => {
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the map data from the public folder
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

  // Set up the map projection
  const projection = geoMercator()
    .center([82.8, 23.4]) // Center of India
    .scale(1000) // Zoom level
    .translate([300, 300]); // Position within the SVG

  const pathGenerator = geoPath().projection(projection);

  return (
    <svg 
        viewBox="0 0 600 600" // A square viewbox works well
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
              stroke="#FFFFFF" // White border between states
              strokeWidth="0.5"
              onMouseEnter={(e) => onStateHover(stateName, count, { x: e.clientX, y: e.clientY })}
              onMouseLeave={onStateLeave}
              onMouseMove={(e) => onStateHover(stateName, count, { x: e.clientX, y: e.clientY })}
              className="transition-all duration-200 ease-in-out cursor-pointer hover:opacity-80"
            />
          );
        })}
      </g>
    </svg>
  );
};

export default IndiaMap;