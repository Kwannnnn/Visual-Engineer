import React, { useState, useEffect, useCallback } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Edge, Node } from 'react-flow-renderer';
import classNames from 'classnames';
import { IPropertyListing } from '../typings/IPropertyListing';
import IObjectContext from '../typings/IObjectContext';

interface PropertiesSidebarProps {
  className?: string;
  initialProperties: IPropertyListing[];
  currentNode: Node | Edge | null;
  onClose: () => void;
  onDelete: (node: Node | Edge) => void;
  onFieldChange?: (node: Node | Edge, field: string, value: string) => void;
  postItem: (item: Partial<IObjectContext>) => Promise<Partial<IObjectContext>>;
  fetchBoardObjects: () => Promise<unknown>;
}

function getPropertyValue(node: Node | Edge | null, propName: string) {
  if (!node) return '';

  const propKey = Object.keys(node.data).find((key) => key === propName);

  const value = node.data[`${propKey}`] ? node.data[`${propKey}`] : '';

  return value;
}

function PropertiesSidebar(props: PropertiesSidebarProps) {
  const {
    className = '',
    initialProperties = [],
    onClose,
    currentNode,
    onFieldChange,
    onDelete,
    postItem,
    fetchBoardObjects,
  } = props;

  const [propValues, setPropValues] = useState<IPropertyListing[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentNode) return;
    const newValues = initialProperties.map((prop) => ({
      ...prop,
      value: getPropertyValue(currentNode, prop.name),
    }));
    setPropValues(newValues);
  }, [initialProperties]);

  const onDeleteHandler = useCallback(() => {
    if (!currentNode) return;
    onDelete(currentNode);
  }, [currentNode]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentNode) return;
    const newProps: IPropertyListing[] = propValues.map((item) => {
      if (item.name === event.target.name) {
        item.value = event.target.value; // update the prop state
        currentNode.data[`${item.name}`] = event.target.value; // update node state
      }

      return item;
    });
    setPropValues(newProps);

    if (!onFieldChange) return;
    if (timer) clearTimeout(timer);

    // If the user is typing, we want to debounce the update to the node
    const delayDebounce = setTimeout(() => {
      onFieldChange(currentNode, event.target.name, event.target.value);
    }, 1500);
    setTimer(delayDebounce);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let item: Partial<IObjectContext> = {};

    propValues.forEach((prop: IPropertyListing) => {
      const tempItem = {
        [prop.name]: prop.value,
      };

      if (prop.value !== '') item = { ...item, ...tempItem };
    });

    if (!currentNode) return;

    const node = currentNode as Node;

    if (node.position) {
      item.x = node.position.x;
      item.y = node.position.y;
    } else {
      item.x = 0;
      item.y = 0;
    }

    item.type = currentNode.data.type;
    await postItem(item);
    await fetchBoardObjects();
    const closeSidebar = onClose;
    closeSidebar();
  };

  return (
    <aside
      data-cy="properties-sidebar"
      className={`w-full h-full flex bg-slate-50 overflow-y-auto border-l border-slate-200 rounded-sm relative ${className}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="sticky top-0 px-6 py-3 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <span>
              <h2
                data-cy="siderbar-item-type"
                className="text-xl inline-block cursor-default font-semibold"
              >
                {currentNode?.data.type ?? ''}
              </h2>
              {currentNode && currentNode.data.isDraft && (
                <span className="bg-amber-100 rounded-md text-amber-600 uppercase px-1.5 py-1.5 ml-1.5 text-sm font-medium">
                  Draft
                </span>
              )}
            </span>
            <FontAwesomeIcon
              data-cy="close-sidebar-btn"
              icon={faXmark}
              className="hover:bg-gray-100 cursor-pointer text-gray-500 hover:text-gray-800 rounded-full px-2 py-1.5"
              size="sm"
              onClick={onClose}
            />
          </div>
          {/* {currentNode && !currentNode.data.isDraft && (
            <input
              type="text"
              value={currentNode?.data.tag}
              className="rounded-lg w-full mt-2 mb-3 border border-gray-300 bg-zinc-200 text-slate-400 px-3 py-2 cursor-not-allowed"
              disabled
            />
          )} */}

          <div
            className={classNames('flex space-x-2 w-full mb-4', {
              'mt-4': currentNode && currentNode.data.isDraft,
            })}
          >
            { currentNode && currentNode.data.isDraft && (
            <button
              data-cy="save-item-btn"
              type="submit"
              className="rounded-lg w-1/2 p-2 shadow-sm hover:shadow-md border border-green-700 hover:bg-green-700 text-green-700 hover:text-white py-2 cursor-pointer mt-auto"
            >
              <p className="hidden md:inline">Publish</p>
            </button>
            )}
            <button
              data-cy="delete-item-btn"
              className={classNames('rounded-lg p-2 shadow-sm hover:shadow-md border border-red-700 hover:bg-red-700 text-red-700 hover:text-white py-2 cursor-pointer', {
                'w-1/2': currentNode && currentNode.data.isDraft,
                'w-full': !(currentNode && currentNode.data.isDraft),
              })}
              type="button"
              onClick={() => onDeleteHandler()}
            >
              <p className="hidden md:inline">Delete</p>
            </button>
          </div>
        </div>

        <div
          data-cy="sidebar-properties-list"
          className="flex flex-col w-full space-y-4 px-6 pt-6 pb-12"
        >
          {propValues.map((p) => {
            const value = getPropertyValue(currentNode, p.name);
            p.value = value;

            return (
              <label key={p.name} htmlFor={`sidebar-input-field-${p.name}`}>
                {p.name}
                <input
                  name={p.name}
                  type={p.type}
                  data-cy={`sidebar-input-field-${p.name}`}
                  value={p.value}
                  onChange={(event) => handleChange(event)}
                  className="focus:ring-2 focus:ring-wb-blue/60 outline-none border border-gray-300 rounded-lg w-full bg-gray-200 text-slate-700 px-3 py-2 mt-1"
                />
              </label>
            );
          })}
        </div>
      </form>
    </aside>
  );
}

export default PropertiesSidebar;
