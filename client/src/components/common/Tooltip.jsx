// src/components/common/Tooltip.jsx
import React from 'react';

// This is a very basic tooltip component. For more advanced features, you might use
// Shadcn/UI's Tooltip, but for a dynamic mouse-following tooltip, a custom one is often easier.
const Tooltip = ({ content, position }) => {
  if (!content) return null;

  const style = {
    position: 'absolute',
    left: `${position.x + 15}px`, // Offset from cursor
    top: `${position.y + 15}px`,
    pointerEvents: 'none', // Allow cursor events to pass through to map
  };

  return (
    <div
      style={style}
      className="z-50 p-2 text-sm border rounded-md shadow-lg bg-background text-foreground border-border"
    >
      {content}
    </div>
  );
};

export default Tooltip;