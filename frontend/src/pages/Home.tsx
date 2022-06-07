import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider, Node, Edge } from 'react-flow-renderer';
import {
  PropertiesSidebar, TabBar, Toolbox
} from '../components';
import NewBoard from '../components/board/NewBoard';
import IBoard from '../typings/IBoard';
import useAPIUtil from '../util/hooks/useAPIUtil';
import {
  getBoardObjects, getObjectTypes, getTypeProperties, getObjectEdges
} from '../api/utility-functions';
import transformObjectToNode from '../util/transformObjectToNode';
import transformConnectionToEdge from '../util/transformConnectionToEdge';
import IObjectContext from '../typings/IObjectContext';
import IOConnectionContext from '../typings/IOConnectionContext';

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
  const [toolboxIsOpen, setToolboxIsOpen] = useState(true);
  const [edges, setEdges] = useState<Edge[]>([]);

  const getBoardObjectsCallback = useCallback(async () => getBoardObjects(currentBoardId), [currentBoardId]);
  const getObjectTypesCallback = useCallback(async () => getObjectTypes(), []);
  const getPropertiesCallback = useCallback(async () => getTypeProperties(currentNode?.data.type), [currentNode]);
  const getEdgesCallback = useCallback(async () => getObjectEdges(), [currentBoardId]);

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
  const { data: objectTypes } = useAPIUtil<any>(getObjectTypesCallback);
  const { data: typeProperties } = useAPIUtil<any>(getPropertiesCallback);
  const { data: objectEdges } = useAPIUtil<IOConnectionContext[]>(getEdgesCallback);

  useEffect(() => {
    if (!boardObjects) return;
    const nodes = transformObjectToNode(boardObjects);
    setInitialNodes(nodes);
  }, [boardObjects]);

  useEffect(() => {
    if (!objectEdges) return;
    const connections = transformConnectionToEdge(objectEdges);
    setEdges(connections);
  }, [objectEdges]);

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

  const toolboxDisplay = currentNode ? 'lg:col-span-12' : 'lg:col-span-17';
  const propertiesDisplay = currentNode ? 'lg:block lg:col-span-5' : 'lg:hidden';

  return (
    <ReactFlowProvider>
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-20 h-full">
          <Toolbox
            isOpen={toolboxIsOpen}
            className="hidden lg:block lg:min-w-sm lg:col-span-3"
            types={types}
          />
          <div className={`col-span-20 ${toolboxDisplay} flex flex-col`}>
            <TabBar currentBoardId={currentBoardId} boards={boards} onSelect={handleTab} />
            <NewBoard
              initialNodes={initialNodes}
              onDropNodeHandler={handleDropNode}
              onNodeClick={(node: Node) => setCurrentNode(node)}
              onNodesDelete={(node: Node[]) => onNodesDeleteCallback(node)}
              initialEdges={edges}
            />
          </div>
          <PropertiesSidebar
            className={`hidden ${propertiesDisplay}`}
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
