import React from 'react';
import { useDragLayer } from 'react-dnd';
import ItemTypes from './item/ItemTypes';
import BoardItem from './BoardItem';

interface DragLayerProps {
    scale: number;
}

function DragLayer({ scale }: DragLayerProps) {
  const {
    isDragging, itemType, currentOffset, item,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  function renderItem() {
    switch (itemType) {
      case ItemTypes.BOARD_ITEM:
        return (
          <BoardItem
            tag={item.tag}
            name={item.name}
            className="px-3 bg-gray-50 w-32 h-24 flex flex-col justify-center items-center relative"
            scale={scale}
          />
        );
      default:
        return null;
    }
  }
  return (
    isDragging ? (
      <div className="fixed pointer-events-none z-50 w-full h-full top-0 left-0">
        <div style={{ transform: `translate(${currentOffset?.x}px, ${currentOffset?.y}px)` }}>
          {renderItem()}
        </div>
      </div>
    ) : null
  );
}

export default DragLayer;
