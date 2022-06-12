import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider, Node, Edge } from 'react-flow-renderer';
import classNames from 'classnames';
import { AxiosError } from 'axios';
import {
  AlertPane,
  PropertiesSidebar,
  TabBar,
  Toolbox,
  Board
} from '../components';
import IBoard from '../typings/IBoard';
import useAPIUtil from '../util/hooks/useAPIUtil';
import {
  getBoardObjects, getObjectTypes, getTypeProperties, getObjectEdges, updateBoardObject, createRelationship, createItem
} from '../util/api/utility-functions';
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
  const [currentNode, setCurrentNode] = useState<Node | Edge | null>(null);
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialProperties, setInitialProperties] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [types, setTypes] = useState<[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const getBoardObjectsCallback = useCallback(async () => getBoardObjects(currentBoardId), [currentBoardId]);
  const getObjectTypesCallback = useCallback(async () => getObjectTypes(), []);
  const getPropertiesCallback = useCallback(async () => currentNode && getTypeProperties(currentNode.data.type), [currentNode]);
  const getEdgesCallback = useCallback(async () => getObjectEdges(), [currentBoardId]);

  const onErrorCallback = useCallback((error: AxiosError, node: Node | Edge) => {
    const { response } = error;
    const { id } = node;
    if (response && response.status === 404) {
      node.data.isDraft = true;
      setErrorMessage(`${node.data.type} ${id} does not exist in the database!
        It has been marked as draft`);
      node.data.tag = undefined;
      setCurrentNode(node);
    }
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onObjectDeleteCallback = useCallback((items: Node[] | Edge[]) => {
    items.forEach((item) => {
      // TODO: Delete object from backend
      if (item.id === currentNode?.id) {
        setCurrentNode(null);
      }
    });
  }, [currentNode]);
  const onNodeMoveCallback = useCallback((node: Node) => {
    const { x, y } = node.position;

    if (!node.data.tag) return;
    updateBoardObject(currentBoardId, node.data.tag, {
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
    }).catch((err: AxiosError) => {
      onErrorCallback(err, node);
    });
  }, [currentBoardId, onErrorCallback]);

  const onNodeFieldUpdateCallback = useCallback((node: Node | Edge, field: string, value: string) => {
    if (!node.data.tag) return;
    updateBoardObject(currentBoardId, node.data.tag, {
      [field]: value,
    }).catch((err: AxiosError) => {
      onErrorCallback(err, node);
    });
  }, [currentBoardId, onErrorCallback]);

  const postItem = (item: Partial<IObjectContext>) => createItem(currentBoardId, { ...item });
  const postRelationship = (relationship: Partial<IOConnectionContext>) => createRelationship(relationship);

  const onConnectionCallback = useCallback((edge: Edge) => {
    // TODO: Once object props are nullable, remove empty strings
    const objectBody: Partial<IObjectContext> = {
      // TODO: once merging with Quan's, remove everything except the type
      tag: `tag-tmp-${Math.floor(Math.random() * (100_000_000 - 0 + 1) + 0)}`,
      name: '',
      length: 0,
      width: 0,
      depth: 0,
      diameter: 0,
      type: edge.data.type,
      pressureClass: 'PN10',
      flange: 0,
      lining: 0,
      x: 0,
      y: 0,
    };

    // TODO: display the pipeline's tag

    postItem(objectBody).then((response) => {
      // TODO: Check for errors
      const newConnection: IOConnectionContext = {
        pipeline: response.tag,
        firstItem: edge.source,
        secondItem: edge.target,
      };

      postRelationship(newConnection)
      // TODO: Check for errors
        .then((result) => {
          const newEdge: Edge = {
            id: result.pipeline.tag,
            source: result.firstItem.tag,
            target: result.secondItem.tag,
            label: result.pipeline.tag,
            type: 'straight',
            style: { cursor: 'pointer', strokeWidth: 3, stroke: '#000' },
            data: {
              type: 'pipeline',
            },
          };

          setEdges((edgesState) => edgesState.concat(newEdge));
          // setCurrentNode(newEdge);
        });
    });
  }, []);

  const { data: boardObjects } = useAPIUtil<Partial<IObjectContext>[]>(getBoardObjectsCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: objectTypes } = useAPIUtil<any>(getObjectTypesCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: typeProperties } = useAPIUtil<any>(getPropertiesCallback);
  const { data: objectEdges } = useAPIUtil<IOConnectionContext[]>(getEdgesCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const { data: postedPipeline } = useAPIUtil<any>(getPipelineCallback);

  useEffect(() => {
    if (!boardObjects) return;
    const nodes = transformObjectToNode(boardObjects);

    setInitialNodes(nodes);
  }, [boardObjects]);

  useEffect(() => {
    if (!objectEdges || !boardObjects) return;
    const connections = transformConnectionToEdge(objectEdges, boardObjects);
    setEdges(connections);
  }, [objectEdges, boardObjects]);

  useEffect(() => {
    if (!objectTypes) return;
    setTypes(objectTypes);
  }, [objectTypes]);

  useEffect(() => {
    if (!typeProperties) return;
    setInitialProperties(typeProperties);
  }, [typeProperties]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  }, [errorMessage]);

  const handleTab = (id: number) => {
    setCurrentNode(null);
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
            { errorMessage && (
              <AlertPane className="transition-opacity ease-in" message={errorMessage} />
            )}
            <Board
              initialNodes={initialNodes}
              onDropNodeHandler={handleDropNode}
              onNodeClick={(node: Node) => setCurrentNode(node)}
              onEdgeClick={(edge: Edge) => setCurrentNode(edge)}
              onEdgeConnect={(edge: Edge) => onConnectionCallback(edge)}
              onNodesDelete={(node: Node[]) => onObjectDeleteCallback(node)}
              onEdgesDelete={(edge: Edge[]) => onObjectDeleteCallback(edge)}
              onNodeMove={(node: Node) => onNodeMoveCallback(node)}
              initialEdges={edges}
            />
          </div>
          <PropertiesSidebar
            className={classNames('hidden', {
              'lg:block lg:col-span-5': currentNode,
            })}
            currentNode={currentNode}
            initialProperties={initialProperties}
            onClose={() => setCurrentNode(null)}
            onFieldChange={(node: Node | Edge, field: string, value: string) => onNodeFieldUpdateCallback(node, field, value)}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default Home;
