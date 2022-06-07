import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider, Node } from 'react-flow-renderer';
import classNames from 'classnames';
import {
  PropertiesSidebar, TabBar, Toolbox
} from '../components';
import NewBoard from '../components/board/Board';
import IBoard from '../typings/IBoard';
import useAPIUtil from '../util/hooks/useAPIUtil';
import { getBoardObjects, getObjectTypes, getTypeProperties } from '../api/utility-functions';
import transformObjectToNode from '../util/transformObjectToNode';
import IObjectContext from '../typings/IObjectContext';

function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boards, setBoards] = useState<IBoard[]>([
    { id: 1, name: 'PTPFu01' },
    { id: 2, name: 'PTPFu02' }
  ]);
  const [currentBoardId, setCurrentBoardId] = useState<number>(1);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialProperties, setInitialProperties] = useState([]);
  const [types, setTypes] = useState<[]>([]);

  const getBoardObjectsCallback = useCallback(async () => getBoardObjects(currentBoardId), [currentBoardId]);
  const getObjectTypesCallback = useCallback(async () => getObjectTypes(), []);
  const getPropertiesCallback = useCallback(async () => getTypeProperties(currentNode?.data.type), [currentNode]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onNodesDeleteCallback = useCallback((nodes: Node[]) => {
    nodes.forEach((node) => {
      // TODO: Delete node from backend
      if (node.data.id === currentNode?.data.id) {
        setCurrentNode(null);
      }
    });
  }, []);

  const { data: boardObjects } = useAPIUtil<Partial<IObjectContext>[]>(getBoardObjectsCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: objectTypes } = useAPIUtil<any>(getObjectTypesCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: typeProperties } = useAPIUtil<any>(getPropertiesCallback);

  useEffect(() => {
    if (!boardObjects) return;
    const nodes = transformObjectToNode(boardObjects);
    setInitialNodes(nodes);
  }, [boardObjects]);

  useEffect(() => {
    if (!objectTypes) return;
    setTypes(objectTypes);
  }, [objectTypes]);

  useEffect(() => {
    if (!typeProperties) return;
    setInitialProperties(typeProperties);
  }, [typeProperties]);

  const handleTab = (id: number) => {
    setCurrentBoardId(id);
  };

  const handleDropNode = (node: Node) => {
    setCurrentNode(node);
  };

  return (
    <ReactFlowProvider>
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-20 h-full">
          <Toolbox
            className="hidden lg:block lg:min-w-sm lg:col-span-3"
            types={types}
          />
          <div className={classNames('flex flex-col col-span-20', {
            'lg:col-span-17': !currentNode,
            'lg:col-span-12': currentNode,
          })}
          >
            <TabBar currentBoardId={currentBoardId} boards={boards} onSelect={handleTab} />
            <NewBoard
              initialNodes={initialNodes}
              onDropNodeHandler={handleDropNode}
              onNodeClick={(node: Node) => setCurrentNode(node)}
              onNodesDelete={(node: Node[]) => onNodesDeleteCallback(node)}
            />
          </div>
          <PropertiesSidebar
            className={classNames('hidden', {
              'lg:block lg:col-span-5': currentNode,
            })}
            currentNode={currentNode}
            initialProperties={initialProperties}
            onClose={() => setCurrentNode(null)}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default Home;
