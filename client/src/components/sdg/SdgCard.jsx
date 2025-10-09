// src/components/sdg/SdgCard.jsx - UPDATED with Local Images

import React from 'react';
import { Link } from 'react-router-dom';
import sdgColors from '../../data/sdg-colors.js'; // Import color data

const SdgCard = ({ sdg }) => {
  if (!sdg) return null;

  // Get the official color from our new data file
  const officialData = sdgColors[sdg.sdgNumber] || { color: '#cccccc' };
  // Dynamically create the path to your local image in the /public folder
  const localImageUrl = `/images/${sdg.sdgNumber}.jpg`;
  const detailLink = `/sdgs/${sdg.sdgNumber}`;

  return (
    <Link
      to={detailLink}
      className="block group aspect-square rounded-lg relative overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
      style={{ backgroundColor: officialData.color }}
    >
      {/* Use the local image URL */}
      <img
        src={localImageUrl}
        alt={sdg.title}
        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Text Overlay for Title */}
      {/* <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4">
        <h3 className="text-white font-bold text-base leading-tight">
            {sdg.title || 'Untitled SDG'}
        </h3>
      </div> */}
    </Link>
  );
};

export default SdgCard;