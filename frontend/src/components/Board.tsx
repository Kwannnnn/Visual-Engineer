import React from 'react';

interface BoardProps {
  className?: string
}

function Board({ className }: BoardProps) {
  return (
    <main className={`overflow-auto ${className}`}>
      Board
    </main>
  );
}

export default Board;
