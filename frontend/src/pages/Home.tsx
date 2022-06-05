import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider, Node } from 'react-flow-renderer';
import {
  PropertiesSidebar, TabBar, Toolbox
} from '../components';
import NewBoard from '../components/board/NewBoard';
import IBoard from '../typings/IBoard';
import useAPIUtil from '../util/hooks/useAPIUtil';
import { getBoardObjects, getObjectTypes } from '../api/utility-functions';
import transformObjectToNode from '../util/transformObjectToNode';

function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boards, setBoards] = useState<IBoard[]>([
    { id: 1, name: 'PTPFu01' },
    { id: 2, name: 'PTPFu02' }
  ]);
  const [currentBoardId, setCurrentBoardId] = useState<number>(1);
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [types, setTypes] = useState<[]>([]);

  const getBoardObjectsCallback = useCallback(async () => getBoardObjects(currentBoardId), [currentBoardId]);
  const getObjectTypesCallback = useCallback(async () => getObjectTypes(), []);

  const { data: boardObjects } = useAPIUtil(getBoardObjectsCallback);
  const { data: objectTypes } = useAPIUtil(getObjectTypesCallback);

  useEffect(() => {
    const nodes = transformObjectToNode(boardObjects);
    setInitialNodes(nodes);
  }, [boardObjects]);

  useEffect(() => {
    setTypes(objectTypes);
  }, [objectTypes]);

  const handleTab = (id: number) => {
    setCurrentBoardId(id);
  };

  return (
    <ReactFlowProvider>
      <div className="flex-1 min-h-0">
        <div className="grid md:grid-cols-12 h-full grid-rows-12">
          <Toolbox
            className="md:col-span-2 md:w-auto w-screen max-h-32 md:max-h-full border-b-4 md:border-r-4"
            types={types}
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
