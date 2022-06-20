import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlowProvider,
  Node,
  Edge,
  updateEdge,
  Connection
} from 'react-flow-renderer';
import classNames from 'classnames';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
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
  getBoardObjects, getObjectTypes, getTypeProperties, getObjectEdges, updateBoardObject, createRelationship, createItem,
  deleteBoardObject,
  updateRelationship,
  getBoardById
} from '../util/api/utility-functions';
import transformObjectToNode from '../util/transformObjectToNode';
import transformConnectionToEdge from '../util/transformConnectionToEdge';
import IObjectContext from '../typings/IObjectContext';
import Modal from '../components/modal/Modal';
import ModalType from '../components/modal/ModalType.enum';
import { IPropertyListing } from '../typings/IPropertyListing';
import IOConnectionContext from '../typings/IOConnectionContext';

function Home() {
  const navigate = useNavigate();
  // States
  const [currentBoardId, setCurrentBoardId] = useState<number>(0);
  const [currentNode, setCurrentNode] = useState<Node | Edge | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [properties, setProperties] = useState<IPropertyListing[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [types, setTypes] = useState<[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [edges, setEdges] = useState<Edge[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boards, setBoards] = useState<IBoard[]>([]);

  // Utility functions callbacks
  const getBoardObjectsCallback = useCallback(
    async () => currentBoardId !== 0 && getBoardObjects(currentBoardId),
    [currentBoardId]
  );
  const getEdgesCallback = useCallback(
    async () => currentBoardId !== 0 && getObjectEdges(),
    [currentBoardId]
  );
  const getObjectTypesCallback = useCallback(async () => getObjectTypes(), []);
  const getPropertiesCallback = useCallback(
    async () => currentNode && getTypeProperties(currentNode.data.type),
    [currentNode]
  );

  // API Util Hooks
  const { data: boardObjects, fetch: fetchBoardObjects } = useAPIUtil<
    Partial<IObjectContext>[]
  >(getBoardObjectsCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: objectTypes } = useAPIUtil<any>(getObjectTypesCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: typeProperties } = useAPIUtil<any>(getPropertiesCallback);
  const { data: objectEdges, fetch: fetchBoardEdges } = useAPIUtil<IOConnectionContext[]>(getEdgesCallback);

  // Event Handlers
  const onErrorHandler = useCallback((error: AxiosError, node: Node | Edge) => {
    const { response } = error;
    const { id } = node;
    if (response && response.status === 404) {
      node.data.isDraft = true;
      setErrorMessage(`${node.data.type} ${id} does not exist in the database!
        It has been marked as draft`);
      node.data.id = undefined;
      setCurrentNode(node);
    }
  }, []);

  /**
   * This function is called when the Delete button is clicked in the modal
   * confirmation dialog. It deletes the node/edge from the database and from the
   * board.
   */
  const onNodeDeleteHandler = useCallback(async () => {
    if (!currentNode) return;

    if (currentNode.data.isDraft) {
      setCurrentNode(null);
      const newNodes = nodes.filter((n) => n.data.id !== currentNode.data.id);
      setNodes(newNodes);
      return;
    }

    try {
      await deleteBoardObject(currentBoardId, currentNode.data.id);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { response } = err;
        if (response && (response.status === 500 || response.status === 0)) {
          setErrorMessage(
            'Unable to connect to the server. Please try again later.'
          );
          return;
        }
      }
    }

    setCurrentNode(null);
    const newNodes = nodes.filter((n) => n.data.id !== currentNode.data.id);
    setNodes(newNodes);
    const newEdges = edges.filter((e) => e.data.tag !== currentNode.data.tag);
    setEdges(newEdges);
  }, [currentNode]);

  /**
   * This function is called when the Node has been moved around on the board.
   * It updates the position of the node in the database. On error it will call the
   * onErrorHandler function.
   */
  const onNodeMoveHandler = (node: Node) => {
    const { x, y } = node.position;

    if (!node.data.id) return;
    updateBoardObject(currentBoardId, node.data.id, {
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
    }).then((item) => {
      const newNodes: Node[] = nodes.filter((n) => n.data.tag !== node.id);
      const nodeToChange: Node | undefined = nodes.find((n) => n.data.tag === node.id);

      nodeToChange!.position.x = item.x;
      nodeToChange!.position.y = item.y;

      newNodes.push(nodeToChange!);
      setNodes(newNodes);
    }).catch((err: AxiosError) => {
      onErrorHandler(err, node);
    });
  };

  /**
   * This function is called when a field of a Node/Edge has been updated in the
   * Properties Sidebar. It updates the changed field of the node/edge in the database.
   */
  const onFieldChangeHandler = useCallback(
    (node: Node | Edge, field: string, value: string) => {
      if (!node.data.tag) return;
      updateBoardObject(currentBoardId, node.id, {
        [field]: value,
      }).then(() => {
        fetchBoardObjects();

        if (node.data.type === 'pipeline') {
          fetchBoardEdges();
        }
      }).catch((err: AxiosError) => {
        onErrorHandler(err, node);
      });
    },
    [currentBoardId, onErrorHandler]
  );

  const postItem = useCallback(
    (item: Partial<IObjectContext>) => createItem(currentBoardId, { ...item }).catch((err) => {
      setErrorMessage(err.response?.data?.message || 'Unknown error');
      return Promise.reject();
    }),
    [currentBoardId]
  );

  const postRelationship = (relationship: Partial<IOConnectionContext>) => createRelationship(relationship).catch((err) => {
    setErrorMessage(err.response?.data?.message || 'Unknown error');
    return Promise.reject();
  });

  const onConnectionCallback = useCallback((type: string, source: string, target: string) => {
    const objectBody: Partial<IObjectContext> = {
      type,
      x: 0,
      y: 0,
    };

    postItem(objectBody).then((response) => {
      const newConnection: IOConnectionContext = {
        pipeline: response.id,
        firstItem: source,
        secondItem: target,
      };

      postRelationship(newConnection)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((result: any) => {
          const pipelineId = result.pipeline.id;
          const newEdge: Edge = {
            id: pipelineId,
            source: result.firstItem.id,
            target: result.secondItem.id,
            label: result.pipeline.tag,
            type: 'straight',
            labelStyle: { cursor: 'pointer' },
            labelBgStyle: { cursor: 'pointer' },
            style: { cursor: 'pointer', strokeWidth: 3, stroke: '#000' },
            data: {
              type: 'pipeline',
              id: pipelineId,
              dataCY: `pipelineEdge-${pipelineId}`,
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
          onErrorHandler(err, draftConnection);
          setCurrentNode(draftConnection);
        });
    });
  }, [currentBoardId]);

  // Use effects
  useEffect(() => {
    if (!boardObjects) return;
    const transformedNodes = transformObjectToNode(boardObjects);
    setNodes(transformedNodes);
    // console.log('nodes: ', nodes);
    // console.log('boardObjects: ', boardObjects);
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
    setProperties(typeProperties);
  }, [typeProperties]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  }, [errorMessage]);

  useEffect(() => {
    const boardsLocalStorage: IBoard[] = JSON.parse(
      localStorage.getItem('boards') || '[]'
    );
    const newBoardsLocalStorage: IBoard[] = [...boardsLocalStorage];

    boardsLocalStorage.forEach((b, i) => {
      getBoardById(b.id).catch(() => {
        newBoardsLocalStorage.splice(i, 1);
      });
    });

    setBoards(newBoardsLocalStorage);
  }, []);

  useEffect(() => {
    const currentBoardLocalStorage = localStorage.getItem('currentBoard');
    if (!currentBoardLocalStorage) return;

    const currentBoard: number = parseInt(currentBoardLocalStorage, 10);
    setCurrentBoardId(currentBoard);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('currentBoard')) return;
    navigate('/projects');
  }, [currentBoardId]);

  const handleTab = (id: number) => {
    setCurrentBoardId(id);
    setCurrentNode(null);
    localStorage.setItem('currentBoard', id.toString());
  };

  const handleCloseTab = (id: number) => {
    const newBoards = boards.filter((b) => b.id !== id);

    if (id === currentBoardId) {
      const newCurrentBoard = newBoards.at(newBoards.length - 1)?.id;
      setCurrentBoardId(newCurrentBoard || 0);

      if (newCurrentBoard) {
        localStorage.setItem('currentBoard', newCurrentBoard.toString());
      } else {
        localStorage.removeItem('currentBoard');
      }
    }

    setBoards(newBoards);
    setCurrentNode(null);
    localStorage.setItem('boards', JSON.stringify(newBoards));
  };

  const handleEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    const pipelineId = oldEdge.id;
    const firstItem = newConnection.source;
    const secondItem = newConnection.target;

    if (!firstItem || !secondItem) {
      return;
    }
    updateRelationship(pipelineId, firstItem, secondItem);
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  };

  const handlePostInitialItem = useCallback((initialItem: Partial<IObjectContext>) => {
    postItem(initialItem).then(
      (item) => {
        // onFullfilled
        const newNode = transformObjectToNode([item])[0];

        setNodes((oldNodes) => oldNodes.concat(newNode));
        setCurrentNode(newNode);
      }
    );
  }, [postItem]);

  const handlePublishItem = (publishingItem: Partial<IObjectContext>) => {
    postItem(publishingItem).then((item) => {
      if (!currentNode) return;

      const n: Node | undefined = nodes.find(
        (node) => node.id === currentNode.id
      );
      const newNodes: Node[] = nodes.filter((node) => node.id !== n!.id);

      const {
        tag, type, x, y,
      } = item;

      n!.id = tag;
      n!.data = {
        dataCY: `itemNode-${tag}`,
        type,
        position: { x, y },
        ...item,
      };
      n!.data.isDraft = false;
      newNodes.push(n!);

      setNodes(newNodes);
      setCurrentNode(n!);
    });
  };

  return (
    <ReactFlowProvider>
      <div className={classNames('flex-1 h-full overflow-hidden', {
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
              onClose={handleCloseTab}
            />
            {errorMessage && (
              <AlertPane
                className="transition-opacity ease-in"
                message={errorMessage}
              />
            )}
            <Board
              initialNodes={nodes}
              onEdgeConnect={(type, source, target) => onConnectionCallback(type, source, target)}
              onEdgeUpdate={handleEdgeUpdate}
              onNodeClick={(node) => node.id !== currentNode?.id && setCurrentNode(node)}
              onEdgeClick={(edge) => edge.id !== currentNode?.id && setCurrentNode(edge)}
              onNodeMove={onNodeMoveHandler}
              initialEdges={edges}
              postInitialItem={handlePostInitialItem}
            />
          </div>
          <PropertiesSidebar
            className={classNames('hidden', {
              'lg:block lg:col-span-5': currentNode,
            })}
            currentNode={currentNode}
            initialProperties={properties}
            onClose={() => setCurrentNode(null)}
            onFieldChange={onFieldChangeHandler}
            publishItem={handlePublishItem}
            onDelete={() => setShowModal(true)}
          />
        </div>
      </div>
      {showModal && (
        <Modal
          dataCY="delete-item-modal"
          showModal={showModal}
          modalType={ModalType.Destructive}
          className="modal fixed z-1 inset-0 bg-slate-50 bg-opacity-70"
          buttonText="Delete"
          title="Delete item"
          closeModal={() => setShowModal(false)}
          onButtonClick={onNodeDeleteHandler}
        >
          <p className="text-sm text-gray-500 mt-1.5">
            {`Are you sure you want to delete ${currentNode?.data.type}
                        with tag ${currentNode?.data.tag}?`}
          </p>
        </Modal>
      )}
    </ReactFlowProvider>
  );
}

export default Home;
