import React, { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from '../components/Board';
import PropertiesSidebar from '../components/PropertiesSidebar';
import Toolbox from '../components/Toolbox';

function Home() {
  const toolboxRef = useRef<HTMLDivElement>(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-12 h-full">
          <Toolbox className="col-span-2" ref={toolboxRef} />
          <Board className="col-span-7" toolboxRef={toolboxRef} />
          <PropertiesSidebar className="col-span-3" />
        </div>
      </div>
    </DndProvider>
  );
}

export default Home;
