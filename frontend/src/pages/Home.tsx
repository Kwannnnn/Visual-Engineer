import React, { useState } from 'react';
import Board from '../components/board/Board';
import TabBar from '../components/board/TabBar';
import PropertiesSidebar from '../components/PropertiesSidebar';
import Toolbox from '../components/Toolbox';
import IBoard from '../typings/Board';

function Home() {
  const [currentBoardId, setCurrentBoardId] = useState<number>(1);
  const [boards, setBoards] = useState<IBoard[]>([
    { id: 1, name: 'PTPFu01' },
    { id: 2, name: 'PTPFu02' }
  ]);

  const handleTab = (id: number) => {
    setCurrentBoardId(id);
  };

  return (
    <div className="flex-1 min-h-0">
      <div className="grid grid-cols-12 h-full">
        <Toolbox className="col-span-2" />
        <div className="col-span-7 flex flex-col">
          <TabBar currentBoardId={currentBoardId} boards={boards} onSelect={handleTab} />
          <Board />
        </div>
        <PropertiesSidebar className="col-span-3" />
      </div>
    </div>
  );
}

export default Home;
