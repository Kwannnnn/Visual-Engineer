import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider, Node, Edge } from 'react-flow-renderer';
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
  createItem,
  deleteBoardObject,
  getBoardObjects,
  getObjectTypes,
  getTypeProperties,
  updateBoardObject,
  getObjectEdges
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
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialProperties, setInitialProperties] = useState<IPropertyListing[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [types, setTypes] = useState<[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [edges, setEdges] = useState<Edge[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boards, setBoards] = useState<IBoard[]>([]);

  // Utility functions callbacks
  const getBoardObjectsCallback = useCallback(async () => currentBoardId !== 0 && getBoardObjects(currentBoardId), [currentBoardId]);
  const getEdgesCallback = useCallback(async () => currentBoardId !== 0 && getObjectEdges(), [currentBoardId]);
  const getObjectTypesCallback = useCallback(async () => getObjectTypes(), []);
  const getPropertiesCallback = useCallback(async () => currentNode && getTypeProperties(currentNode.data.type), [currentNode]);

  // API Util Hooks
  const { data: boardObjects, fetch: fetchBoardObjects } = useAPIUtil<Partial<IObjectContext>[]>(getBoardObjectsCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: objectTypes } = useAPIUtil<any>(getObjectTypesCallback);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: typeProperties } = useAPIUtil<any>(getPropertiesCallback);
  const { data: objectEdges } = useAPIUtil<IOConnectionContext[]>(getEdgesCallback);

  // Event Handlers
  const onErrorHandler = useCallback((error: AxiosError, node: Node | Edge) => {
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

  /**
   * This function is called when the Delete button is clicked in the modal
   * confirmation dialog. It deletes the node/edge from the database and from the
   * board.
   */
  const onNodeDeleteHandler = useCallback(async () => {
    if (!currentNode) return;

    if (currentNode.data.isDraft) {
      setCurrentNode(null);
      const newNodes = initialNodes.filter((n) => n.data.tag !== currentNode.data.tag);
      setInitialNodes(newNodes);
      return;
    }

    try {
      await deleteBoardObject(currentBoardId, currentNode.data.tag);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const { response } = err;
        if (response && (response.status === 500 || response.status === 0)) {
          setErrorMessage('Unable to connect to the server. Please try again later.');
          return;
        }
      }
    }

    setCurrentNode(null);
    const newNodes = initialNodes.filter((n) => n.data.tag !== currentNode.data.tag);
    setInitialNodes(newNodes);
  }, [currentNode]);

  /**
   * This function is called when the Node has been moved around on the board.
   * It updates the position of the node in the database. On error it will call the
   * onErrorHandler function.
   */
  const onNodeMoveHandler = useCallback((node: Node) => {
    const { x, y } = node.position;

    if (!node.data.tag) return;
    updateBoardObject(currentBoardId, node.data.tag, {
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
    }).catch((err: AxiosError) => {
      onErrorHandler(err, node);
    });
  }, [currentBoardId, onErrorHandler]);

  /**
   * This function is called when a field of a Node/Edge has been updated in the
   * Properties Sidebar. It updates the changed field of the node/edge in the database.
   */
  const onFieldChangeHandler = useCallback((node: Node | Edge, field: string, value: string) => {
    if (!node.data.tag) return;
    updateBoardObject(currentBoardId, node.data.tag, {
      [field]: value,
    }).catch((err: AxiosError) => {
      onErrorHandler(err, node);
    });
  }, [currentBoardId, onErrorHandler]);

  // Use effects
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

  useEffect(() => {
    const boardsLocalStorage: IBoard[] = JSON.parse(localStorage.getItem('boards') || '[]');
    setBoards(boardsLocalStorage);
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

  const handleDropNode = (node: Node) => {
    setCurrentNode(node);
  };

  const postItem = (item: Partial<IObjectContext>) => createItem(currentBoardId, { ...item }).catch((err) => {
    setErrorMessage(err.response?.data?.message || 'Unknown error');
    return Promise.reject();
  });

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
              initialNodes={initialNodes}
              onDropNodeHandler={handleDropNode}
              onNodeClick={(node) => node.id !== currentNode?.id && setCurrentNode(node)}
              onEdgeClick={(edge) => edge.id !== currentNode?.id && setCurrentNode(edge)}
              onNodeMove={onNodeMoveHandler}
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
            onFieldChange={onFieldChangeHandler}
            postItem={postItem}
            fetchBoardObjects={fetchBoardObjects}
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
          description={`Are you sure you want to delete ${currentNode?.data.type}
                        with tag ${currentNode?.data.tag}?`}
          closeModal={() => setShowModal(false)}
          onButtonClick={onNodeDeleteHandler}
        />
      )}
    </ReactFlowProvider>
  );
}

export default Home;
