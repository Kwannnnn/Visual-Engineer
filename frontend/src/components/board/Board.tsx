import React, {
  useState,
  useRef,
  WheelEventHandler,
  PointerEventHandler
} from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { motion, useDragControls } from 'framer-motion';
import DropPlaceholder from './DropPlaceholder';
import ItemTypes from './item/ItemTypes';
import BoardItem from './BoardItem';
import DragLayer from './DragLayer';
import Item from './item/Item';
import Items from './item/ItemsList';

interface BoardProps {
  className?: string;
}

function Board({ className }: BoardProps) {
  // Constant parameters
  const SCROLL_DISTANCE = 700;
  const SCALE_AMOUNT = 0.06;
  const MIN_SCALE = 0.6;
  const MAX_SCALE = 1.5;
  const ASPECT_RATIO = 1.3;

  const constraintsRef = useRef(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  const dragControls = useDragControls();

  const [canDrag, setCanDrag] = useState(true);

  const startDrag: PointerEventHandler<HTMLDivElement> = (event) => {
    dragControls.start(event, { snapToCursor: false });
  };

  const handleScaleScroll: WheelEventHandler<HTMLDivElement> = (e) => {
    const positive = e.deltaY < 0;

    const scaleModification = SCALE_AMOUNT * (positive ? 1 : -1);

    let newScale = scale + scaleModification;

    if (scale > MAX_SCALE) {
      newScale = MAX_SCALE;
    } else if (scale < MIN_SCALE) {
      newScale = MIN_SCALE;
    }

    setScale(newScale);
  };

  // set the initial state of the board as an empty array of Items
  // and declare a setBoard function that updates the board when being called
  const [board, setBoard] = useState<Item[]>([]);

  // updates the board's state everytime a new item is dropped
  // or when an item is moved around the board
  const updateBoard = (item: Item) => {
    // this loops through the existing items on the board
    // by comparing the items' tags with the one's being
    // dropped and passed as an argument;
    // stores what is being returned in a new variable
    const foundItem = board.find((i) => i.tag === item.tag);

    // if it's not an existing item, adds it to the board's items
    // else, updates the item's position and sets the new state of the board
    if (foundItem === undefined) {
      board.push(item);
    } else {
      const index = board.indexOf(foundItem);
      Object.assign(foundItem, item);
      board[index] = foundItem;
    }
    setBoard(board);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getItemByType = (itemType: any, itemName: string) => {
    let foundItem;

    // gets the item from the hardcoded items list
    // or from the ones on the board
    if (itemType === ItemTypes.ITEM) {
      foundItem = Items.find((i) => i.name === itemName);
    } else {
      foundItem = board.find((i) => i.name === itemName);
    }

    return foundItem;
  };

  const updateItemOffsets = (foundItem: Item, monitor: DropTargetMonitor<Pick<Item, 'name'>>) => {
    let newItem;

    // the x,y position of the pointer when dropping an item
    const delta = monitor.getClientOffset();

    // get the board element's properties, like size and position
    const boardRect = boardRef.current?.getBoundingClientRect();

    if (delta && boardRect) {
      // subtract the top-left corner coordinates of the board
      // from the pointer's last offset
      let left = delta.x - boardRect.left;
      let top = delta.y - boardRect.top;

      // the resulted top, left values should be calculated
      // relatively to the board's scale
      left /= scale;
      top /= scale;

      // the x,y position of the pointer when clicking
      // on the item that is going to be dragged
      const initialClientOffset = monitor.getInitialClientOffset();

      // the item's top-left corner position
      // when the dragging process starts
      const initialSourceClientOffset = monitor.getInitialSourceClientOffset();

      const itemType = monitor.getItemType();

      // calculate the item's local position on the board
      if (itemType === ItemTypes.BOARD_ITEM && initialClientOffset
            && initialSourceClientOffset) {
        const localOffset = {
          x: initialClientOffset.x - initialSourceClientOffset.x,
          y: initialClientOffset.y - initialSourceClientOffset.y,
        };

        left -= localOffset.x;
        top -= localOffset.y;
      }

      // update the item's position with the newly calculated values
      newItem = update(foundItem, {
        left: { $set: left },
        top: { $set: top },
      });
    }

    return newItem;
  };

  // React DnD hook that sets the board as a drop target;
  // it accepts two different types: a new item being dropped,
  // and an existing item on the board, that changes its position;
  // it returns the collected props of the item being dragged: canDrop and isOver,
  // (which are not being used at the moment)
  // and the drop reference that is being attached to the
  // target, in this case, the DropPlaceholder component
  const [, drop] = useDrop<Pick<Item, 'name'>>(
    () => ({
      accept: [ItemTypes.ITEM, ItemTypes.BOARD_ITEM],
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
      drop(item, monitor) {
        const itemType = monitor.getItemType();
        const itemName = item.name;
        const foundItem = getItemByType(itemType, itemName);
        if (foundItem === undefined) {
          return;
        }

        const newItem = updateItemOffsets(foundItem, monitor);
        if (newItem === undefined) {
          return;
        }

        // set the state of the board with the updated item
        updateBoard(newItem);
        setCanDrag(true);
      },
    }),

    [board, scale]
  );

  return (
    <motion.main
      className={`overflow-hidden bg-neutral-200 relative flex flex-1 justify-center items-center ${className}`}
      id="board"
      onWheel={handleScaleScroll}
      onPointerDown={startDrag}
      ref={constraintsRef}
    >
      <motion.div
        ref={boardRef}
        className="bg-white z-50 transform-gpu"
        animate={{ scale }}
        style={{
          width: '85%',
          aspectRatio: ASPECT_RATIO.toString(),
          translateY: 0.1,
        }}
        drag={canDrag}
        dragControls={dragControls}
        dragElastic={0.2}
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 1000 }}
        dragConstraints={{
          left: -SCROLL_DISTANCE * scale,
          right: SCROLL_DISTANCE * scale,
          bottom: SCROLL_DISTANCE * (scale / ASPECT_RATIO),
          top: -SCROLL_DISTANCE * (scale / ASPECT_RATIO),
        }}
        whileHover={{ cursor: 'grab' }}
      >
        {board?.map((item) => (
          <BoardItem
            key={item.tag}
            tag={item.tag}
            name={item.name}
            className="px-3 bg-gray-50 w-32 h-24 flex flex-col justify-center items-center"
            top={item.top}
            left={item.left}
            setCanDrag={setCanDrag}
            scale={1}
          />
        ))}
        <DropPlaceholder innerRef={drop} />
      </motion.div>
      <DragLayer scale={scale} />
    </motion.main>
  );
}

export default Board;
