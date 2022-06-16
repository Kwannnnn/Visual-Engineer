import React from 'react';
import IBoard from '../../../typings/IBoard';
import Tab from './Tab';

interface TabBarProps {
  currentBoardId: number;
  boards: IBoard[];
  onSelect?: (id: number) => void;
  onClose?: (id: number) => void;
}

function TabBar({
  currentBoardId, boards, onSelect, onClose,
}: TabBarProps) {
  const handleSelect = (id: number) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const handleClose = (id: number) => {
    if (onClose) {
      onClose(id);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 z-10 w-full h-12 flex overflow-hidden">
      {boards.map((board) => (
        <Tab
          key={board.id}
          id={board.id}
          name={board.name}
          onSelect={handleSelect}
          onClose={handleClose}
          active={board.id === currentBoardId}
        />
      ))}
    </div>
  );
}

export default TabBar;
