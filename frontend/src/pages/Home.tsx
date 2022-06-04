import React, { useState, useEffect } from 'react';
import { ReactFlowProvider, Node } from 'react-flow-renderer';
import {
  PropertiesSidebar, TabBar, Toolbox
} from '../components';
import NewBoard from '../components/board/NewBoard';
import IBoard from '../typings/IBoard';
import { getBoardObjects } from '../api/utility-functions';

function Home() {
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  useEffect(() => {
    getBoardObjects(1)
      .then((response) => {
        // eslint-disable-next-line max-len
        response.forEach((item: { tag: string; type: string; name: string; x: number; y: number; }) => {
          const node:Node = {
            id: item.tag,
            type: 'itemNode',
            data: { label: item.type },
            position: { x: item.x, y: item.y },
          };
          setInitialNodes((n) => n.concat(node));
        });
      })
      .catch((error) => {
        setInitialNodes([]);
      });
  }, []);
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
            <NewBoard initialNodes={initialNodes} />
          </div>
          <PropertiesSidebar className="md:col-span-3" />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default Home;
