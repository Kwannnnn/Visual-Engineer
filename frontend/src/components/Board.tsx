import React from 'react';

interface BoardProps {
  className?: string
}

function Board({ className }: BoardProps) {
  return (
    <div className={`${className}`}>Board</div>
  );
}

export default Board;
