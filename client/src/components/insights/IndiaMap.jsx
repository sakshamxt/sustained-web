// src/components/insights/IndiaMap.jsx
import React from 'react';

const IndiaMap = ({ data, colorScale, onStateHover, onStateLeave }) => {
  // A mapping from potential SVG 'id' attributes to the names your API provides.
  // You might need to adjust this based on the SVG you find.
  const stateIdMap = {
    "Andhra Pradesh": "Andhra Pradesh",
    "Arunachal Pradesh": "Arunachal Pradesh",
    "Tamil Nadu": "Tamil Nadu",
    "Karnataka": "Karnataka",
    // ... add all other states and union territories ...
  };

  // HYPOTHETICAL SVG PATHS. REPLACE THESE WITH PATHS FROM YOUR ACTUAL SVG FILE.
  const svgPaths = [
    { id: "Andhra Pradesh", d: "M 50 50 L 100 50 L 100 100 L 50 100 Z" }, // This is just a sample square
    { id: "Tamil Nadu", d: "M 150 150 L 200 150 L 200 200 L 150 200 Z" },
    { id: "Karnataka", d: "M 250 250 L 300 250 L 300 300 L 250 300 Z" },
    // PASTE ALL YOUR <path> ELEMENTS FROM YOUR SVG HERE, CONVERTED TO THIS JSX FORMAT.
  ];

  return (
    <svg 
        version="1.1" 
        id="india-map" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 800 920" // Adjust viewBox based on your SVG's original attributes
        className="w-full h-auto"
    >
      <g>
        {svgPaths.map((statePath) => {
          const stateName = stateIdMap[statePath.id];
          const stateData = stateName ? data[stateName] : undefined;
          const count = stateData ? stateData.count : 0;
          const fillColor = colorScale(count);

          return (
            <path
              key={statePath.id}
              id={statePath.id}
              d={statePath.d}
              fill={fillColor}
              stroke="#FFFFFF" // White border between states
              strokeWidth="1"
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