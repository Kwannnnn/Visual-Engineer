import React from 'react';

interface BoardItemProps {
  className?: string;
  tag: string;
  name: string;
}

function BoardItem({ className, tag, name }: BoardItemProps) {
  return (
    <div id={tag} className={`bg-slate-50 border-2 border-black ${className}`}>
      <div>{tag}</div>
      <div>{name}</div>
    </div>
  );
}

export default BoardItem;
