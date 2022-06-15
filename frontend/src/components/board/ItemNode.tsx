import classNames from 'classnames';
import React, { useContext } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { DragContext } from './Board';

interface ItemNodeProps {
  className?: string;
  data: {
    tag?: string;
    type: string;
    isDraft: boolean;
    dataCY: string;
  };
}

function ItemNode(props: ItemNodeProps) {
  const { className = '', data } = props;
  const {
    tag = '', type, dataCY, isDraft,
  } = data;

  const dragContext = useContext(DragContext);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id={`top-${dataCY}`}
        data-cy={`top-${dataCY}`}
        className="hover:border-4 hover:border-gray-300 hidden"
        // style={{
        //   height: 14,
        //   width: 14,
        //   top: -7,
        // }}
      />
      <div
        data-cy={dataCY}
        className={classNames(`bg-slate-50 border-2 px-12 py-8 border-black ${className}`, {
          'bg-amber-50': isDraft,
        })}
        style={{ zIndex: 5 }}
      >
        <div>{tag}</div>
        <div>{type}</div>
        <Handle
          type="source"
          position={Position.Top}
          id={`bottom-${dataCY}`}
          data-cy={`bottom-${dataCY}`}
          className="hover:border-4 hover:border-gray-300"
          style={{
            height: 14,
            width: 14,
            top: 20,
          }}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          id={`bottom-${dataCY}`}
          data-cy={`bottom-${dataCY}`}
          className="hover:border-4 hover:border-gray-300"
          style={{
            height: '100%',
            width: '100%',
            bottom: 0,
            borderRadius: 0,
            display: !dragContext.connecting ? 'none' : 'initial',
            backgroundColor: 'transparent',
            border: 'none',
          }}
        />
      </div>
    </>
  );
}

export default ItemNode;
