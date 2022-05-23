import React from 'react';
import IBoard from '../../typings/Board';
import Tab from './Tab';

interface TabBarProps {
  currentBoardId: number;
  boards: IBoard[];
  onSelect?: (id: number) => void;
}

function TabBar({ currentBoardId, boards, onSelect }: TabBarProps) {
  const handleSelect = (id: number) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div className="bg-white shadow z-10 flex">
      {boards.map((board) => (
        <Tab
          key={board.id}
          id={board.id}
          name={board.name}
          onSelect={handleSelect}
          active={board.id === currentBoardId}
        />
      ))}
    </div>
  );
}

export default TabBar;
