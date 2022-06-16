import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <div
      data-cy={dataCY}
      className={classNames(`bg-slate-50 border-2 px-12 py-4 border-black overflow-hidden flex flex-col items-center ${className}`, {
        'bg-amber-50': isDraft,
      })}
    >
      <div className="mb-4 flex flex-col items-center">
        <div>{tag}</div>
        <div>{type}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id={`source-${dataCY}`}
        data-cy={`source-${dataCY}`}
        className="!bg-gray-200 !h-6 !rounded-none !border-none !bottom-0 w-full mb-0.5"
        style={{
          width: 'calc(100% - 4px)',
        }}
      >
        <div className="flex-1 flex items-center justify-center h-full pointer-events-none">
          <FontAwesomeIcon icon={faPlus} className="text-gray-400" />
        </div>
      </Handle>
      <Handle
        type="target"
        position={Position.Bottom}
        id={`target-${dataCY}`}
        data-cy={`target-${dataCY}`}
        className="hover:border-4 hover:border-gray-300"
        style={{
          height: '100%',
          width: '100%',
          bottom: 0,
          borderRadius: 0,
          display: !dragContext.connecting ? 'none' : 'initial',
          // backgroundColor: 'transparent',
          border: 'none',
        }}
      />
    </div>
  );
}

export default ItemNode;
