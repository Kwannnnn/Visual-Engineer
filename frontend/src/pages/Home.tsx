import React, { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Board, PropertiesSidebar, TabBar, Toolbox
} from '../components';
import IBoard from '../typings/Board';

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

  const toolboxRef = useRef<HTMLDivElement>(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 min-h-0">
        <div className="grid md:grid-cols-12 h-full grid-rows-12">
          <Toolbox
            className="md:col-span-2 md:w-auto w-screen max-h-32 md:max-h-full border-b-4 md:border-r-4"
            ref={toolboxRef}
          />
          <div className="col-span-7 flex flex-col">
            <TabBar currentBoardId={currentBoardId} boards={boards} onSelect={handleTab} />
            <Board toolboxRef={toolboxRef} />
          </div>
          <PropertiesSidebar className="md:col-span-3" />
        </div>
      </div>
    </DndProvider>
  );
}

export default Home;
