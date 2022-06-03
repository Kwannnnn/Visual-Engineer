import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

interface ItemNodeProps {
  className?: string;
  data: {
    label: string;
    dataCY: string;
  };
}

function ItemNode(props: ItemNodeProps) {
  const {
    className = '', data,
  } = props;
  const { label, dataCY } = data;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id={`top${label}}`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`left${label}}`}
      />
      <div
        data-cy={dataCY}
        className={`bg-slate-50 border-2 px-12 py-8 border-black ${className}`}
      >

        <div>{label}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id={`bottom${label}}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`right${label}}`}
      />
    </>
  );
}

export default ItemNode;
