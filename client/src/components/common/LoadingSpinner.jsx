// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = "md" }) => {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-primary`} />
    </div>
  );
};

export default LoadingSpinner;