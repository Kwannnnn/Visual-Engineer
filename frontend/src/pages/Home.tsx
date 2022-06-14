import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider, Node } from 'react-flow-renderer';
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
  deleteBoardObject,
  getBoardObjects,
  getObjectTypes,
  getTypeProperties,
  updateBoardObject
} from '../util/api/utility-functions';
import transformObjectToNode from '../util/transformObjectToNode';
import IObjectContext from '../typings/IObjectContext';
import { IListing } from '../typings/IListing';
import Modal from '../components/modal/Modal';
import ModalType from '../components/modal/ModalType.enum';

function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boards, setBoards] = useState<IBoard[]>([
    { id: 1, name: 'PTPFu01' },
    { id: 2, name: 'PTPFu02' }
  ]);
  const [currentBoardId, setCurrentBoardId] = useState<number>(1);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialProperties, setInitialProperties] = useState<IListing[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [types, setTypes] = useState<[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const getBoardObjectsCallback = useCallback(
    async () => getBoardObjects(currentBoardId),
    [currentBoardId]
  );
  const getObjectTypesCallback = useCallback(async () => getObjectTypes(), []);
  const getPropertiesCallback = useCallback(async () => currentNode && getTypeProperties(currentNode.data.type), [currentNode]);
  const onErrorCallback = useCallback((error: AxiosError, node: Node) => {
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

  const onNodeDelete = useCallback(async () => {
    if (!currentNode) return;

    if (currentNode.data.isDraft) {
      const newNodes = initialNodes.filter((n) => n.data.tag !== currentNode.data.tag);
      setInitialNodes(newNodes);
      setCurrentNode(null);
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

  const onNodeFieldUpdateCallback = useCallback((node: Node, field: string, value: string) => {
    if (!node.data.tag) return;
    updateBoardObject(currentBoardId, node.data.tag, {
      [field]: value,
    }).catch((err: AxiosError) => {
      onErrorCallback(err, node);
    });
  }, [currentBoardId, onErrorCallback]);

  const { data: boardObjects } = useAPIUtil<Partial<IObjectContext>[]>(
    getBoardObjectsCallback
  );
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

  const postInitialItem = (x: number, y: number, type: string) => createItem(currentBoardId, {
    type,
    x,
    y,
  });

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
            <TabBar currentBoardId={currentBoardId} boards={boards} onSelect={handleTab} />
            { errorMessage && (
              <AlertPane className="transition-opacity ease-in" message={errorMessage} />
            )}
            <Board
              initialNodes={initialNodes}
              onDropNodeHandler={handleDropNode}
              onNodeClick={(node) => setCurrentNode(node)}
              onNodeMove={(node) => onNodeMoveCallback(node)}
              postInitialItem={postInitialItem}
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
          onButtonClick={() => onNodeDelete()}
        />
      )}
    </ReactFlowProvider>
  );
}

export default Home;
