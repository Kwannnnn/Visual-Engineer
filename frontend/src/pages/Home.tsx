import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlowProvider, Node, Edge, updateEdge, Connection
} from 'react-flow-renderer';
import classNames from 'classnames';
import axios, { AxiosError } from 'axios';
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
  createItem,
  createRelationship,
  deleteBoardObject,
  getBoardObjects,
  getObjectTypes,
  getTypeProperties,
  updateBoardObject,
  getObjectEdges,
  updateRelationship
} from '../util/api/utility-functions';
import transformObjectToNode from '../util/transformObjectToNode';
import transformConnectionToEdge from '../util/transformConnectionToEdge';
import IObjectContext from '../typings/IObjectContext';
import { IPropertyListing } from '../typings/IPropertyListing';
import IOConnectionContext from '../typings/IOConnectionContext';
import Modal from '../components/modal/Modal';
import ModalType from '../components/modal/ModalType.enum';

function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boards, setBoards] = useState<IBoard[]>([
    { id: 1, name: 'PTPFu01' },
    { id: 2, name: 'PTPFu02' }
  ]);
  const [currentBoardId, setCurrentBoardId] = useState<number>(1);
  const [currentNode, setCurrentNode] = useState<Node | Edge | null>(null);
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialProperties, setInitialProperties] = useState<IPropertyListing[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [types, setTypes] = useState<[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const getBoardObjectsCallback = useCallback(async () => getBoardObjects(currentBoardId), [currentBoardId]);
  const getEdgesCallback = useCallback(async () => getObjectEdges(), [currentBoardId]);
  const getObjectTypesCallback = useCallback(async () => getObjectTypes(), []);
  const getPropertiesCallback = useCallback(async () => currentNode && getTypeProperties(currentNode.data.type), [currentNode]);
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

  const { data: boardObjects, fetch: fetchBoardObjects } = useAPIUtil<Partial<IObjectContext>[]>(getBoardObjectsCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: objectTypes } = useAPIUtil<any>(getObjectTypesCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: typeProperties } = useAPIUtil<any>(getPropertiesCallback);
  const { data: objectEdges } = useAPIUtil<IOConnectionContext[]>(getEdgesCallback);

  const postItem = (item: Partial<IObjectContext>) => createItem(currentBoardId, { ...item }).catch((err: AxiosError) => {
    setErrorMessage(err.message || 'Unknown error');
    return Promise.reject();
  });
  const postRelationship = (relationship: Partial<IOConnectionContext>) => createRelationship(relationship).catch((err: AxiosError) => {
    setErrorMessage(err.message || 'Unknown error');
    return Promise.reject();
  });

  const onConnectionCallback = useCallback((type: string, source: string, target: string) => {
    const objectBody: Partial<IObjectContext> = {
      type,
      x: 1,
      y: 1,
    };

    postItem(objectBody).then((response) => {
      const newConnection: IOConnectionContext = {
        pipeline: response.tag,
        firstItem: source,
        secondItem: target,
      };

      postRelationship(newConnection)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((result: any) => {
          const newEdge: Edge = {
            id: result.pipeline.tag,
            source: result.firstItem.tag,
            target: result.secondItem.tag,
            label: result.pipeline.tag,
            type: 'straight',
            style: { cursor: 'pointer', strokeWidth: 3, stroke: '#000' },
            data: {
              type: 'pipeline',
              tag: result.pipeline.tag,
            },
          };
          setEdges((edgesState) => edgesState.concat(newEdge));
          setCurrentNode(newEdge);
        }).catch((err: AxiosError) => {
          const draftConnection: Edge = {
            id: `${source}_${target}`,
            source: source ?? '',
            target: target ?? '',
            label: 'Draft Pipeline',
            labelBgPadding: [8, 4],
            labelBgBorderRadius: 4,
            labelBgStyle: {
              cursor: 'pointer', fill: '#FFCC00', color: '#fff',
            },
            type: 'straight',
            style: { cursor: 'pointer', strokeWidth: 3, stroke: '#000' },
            data: {
              type: 'pipeline',
              isDraft: true,
            },
          };
          setEdges((edgesState) => edgesState.concat(draftConnection));
          onErrorCallback(err, draftConnection);
          setCurrentNode(draftConnection);
        });
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onObjectDeleteCallback = useCallback(
    (items: Node[] | Edge[]) => {
      items.forEach((item) => {
        // TODO: Delete object from backend
        if (item.id === currentNode?.id) {
          setCurrentNode(null);
        }
      });
    },
    [currentNode]
  );

  const onNodeDelete = useCallback(async () => {
    if (!currentNode) return;

    if (currentNode.data.isDraft) {
      setCurrentNode(null);
      fetchBoardObjects();
      return;
    }

    let response500 = false;
    try {
      await deleteBoardObject(currentBoardId, currentNode.data.tag);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { response } = err;
        if (response && (response.status === 500 || response.status === 0)) {
          response500 = true;
          setErrorMessage('Unable to connect to the server. Please try again later.');
        }
      }
    } finally {
      // Check whether there was a 500 error to avoid deleting the node from the frontend
      if (!response500) {
        const newNodes = initialNodes.filter((n) => n.data.tag !== currentNode.data.tag);
        setInitialNodes(newNodes);
        setCurrentNode(null);
      }
    }
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

  const onNodeFieldUpdateCallback = useCallback(
    (node: Node | Edge, field: string, value: string) => {
      if (!node.data.tag) return;
      updateBoardObject(currentBoardId, node.data.tag, {
        [field]: value,
      }).catch((err: AxiosError) => {
        onErrorCallback(err, node);
      });
    },
    [currentBoardId, onErrorCallback]
  );

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

  const handleEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    const pipelineTag = oldEdge.id;
    const firstItem = newConnection.source;
    const secondItem = newConnection.target;

    if (!firstItem || !secondItem) {
      return;
    }
    updateRelationship(pipelineTag, firstItem, secondItem);
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  };

  return (
    <ReactFlowProvider>
      <div className={classNames('flex-1 h-full', {
        'z-0': showModal,
      })}
      >
        <div className="grid grid-cols-20 h-full">
          <Toolbox
            className="hidden lg:block lg:min-w-sm lg:col-span-3"
            types={types}
          />
          <div
            className={classNames('flex flex-col col-span-20', {
              'lg:col-span-17': !currentNode,
              'lg:col-span-12': currentNode,
            })}
          >
            <TabBar
              currentBoardId={currentBoardId}
              boards={boards}
              onSelect={handleTab}
            />
            {errorMessage && (
              <AlertPane
                className="transition-opacity ease-in"
                message={errorMessage}
              />
            )}
            <Board
              initialNodes={initialNodes}
              onDropNodeHandler={handleDropNode}
              onNodeClick={(node) => setCurrentNode(node)}
              onEdgeClick={(edge) => setCurrentNode(edge)}
              onEdgesDelete={(edge) => onObjectDeleteCallback(edge)}
              onNodeMove={(node) => onNodeMoveCallback(node)}
              onEdgeUpdate={handleEdgeUpdate}
              onEdgeConnect={(type, source, target) => onConnectionCallback(type, source, target)}
              initialEdges={edges}
              postItem={postItem}
            />
          </div>
          <PropertiesSidebar
            className={classNames('hidden', {
              'lg:block lg:col-span-5': currentNode,
            })}
            currentNode={currentNode}
            initialProperties={initialProperties}
            onClose={() => setCurrentNode(null)}
            onFieldChange={(node, field, value) => onNodeFieldUpdateCallback(node, field, value)}
            // postItem={postItem}
            // fetchBoardObjects={fetchBoardObjects}
            onDelete={() => setShowModal(true)}
          />
        </div>
      </div>
      {showModal && (
        <Modal
          showModal={showModal}
          modalType={ModalType.Destructive}
          className="modal fixed z-1 inset-0 bg-slate-50 bg-opacity-70"
          buttonText="Delete"
          title="Delete item"
          description={`Are you sure you want to delete ${currentNode?.data.type}
                        with tag ${currentNode?.data.tag}?`}
          closeModal={() => setShowModal(false)}
          onButtonClick={() => onNodeDelete()}
        />
      )}
    </ReactFlowProvider>
  );
}

export default Home;
