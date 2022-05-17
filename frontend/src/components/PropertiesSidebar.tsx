import React from 'react';

interface PropertiesSidebarProps {
  className?: string
}

function PropertiesSidebar({ className }: PropertiesSidebarProps) {
  return (
    <div className={`bg-green-500 ${className}`}>PropertiesSidebar</div>
  );
}

export default PropertiesSidebar;
