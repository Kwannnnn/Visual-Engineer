import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

interface ItemNodeProps {
  className?: string;
  data: {
    tag?: string;
    type: string;
    dataCY: string;
  };
}

function ItemNode(props: ItemNodeProps) {
  const { className = '', data } = props;
  const { tag = '', type, dataCY } = data;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id={`top-${dataCY}`}
        data-cy={`top-${dataCY}`}
        className="hover:border-4 hover:border-gray-300"
        style={{
          height: 14,
          width: 14,
          top: -7,
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`left-${dataCY}`}
        data-cy={`left-${dataCY}`}
        className="hover:border-4 hover:border-gray-300"
        style={{
          height: 14,
          width: 14,
          left: -7,
        }}
      />
      <div
        data-cy={dataCY}
        className={`bg-slate-50 border-2 px-12 py-8 border-black ${className}`}
      >
        <div>{tag}</div>
        <div>{type}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id={`bottom-${dataCY}`}
        data-cy={`bottom-${dataCY}`}
        className="hover:border-4 hover:border-gray-300"
        style={{
          height: 14,
          width: 14,
          bottom: -7,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`right-${dataCY}`}
        data-cy={`right-${dataCY}`}
        className="hover:border-4 hover:border-gray-300"
        style={{
          height: 14,
          width: 14,
          right: -7,
        }}
      />
    </>
  );
}

export default ItemNode;
