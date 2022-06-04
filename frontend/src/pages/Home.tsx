import React, { useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import {
  PropertiesSidebar, TabBar, Toolbox
} from '../components';
import NewBoard from '../components/board/NewBoard';
import IBoard from '../typings/IBoard';

function Home() {
  const [currentBoardId, setCurrentBoardId] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boards, setBoards] = useState<IBoard[]>([
    { id: 1, name: 'PTPFu01' },
    { id: 2, name: 'PTPFu02' }
  ]);

  const handleTab = (id: number) => {
    setCurrentBoardId(id);
  };

  return (
    <ReactFlowProvider>
      <div className="flex-1 min-h-0">
        <div className="grid md:grid-cols-12 h-full grid-rows-12">
          <Toolbox
            className="md:col-span-2 md:w-auto w-screen max-h-32 md:max-h-full border-b-4 md:border-r-4"
          />
          <div className="col-span-7 flex flex-col">
            <TabBar currentBoardId={currentBoardId} boards={boards} onSelect={handleTab} />
            <NewBoard />
          </div>
          <PropertiesSidebar className="md:col-span-3" />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default Home;
