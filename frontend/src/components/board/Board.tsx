import React, {
  useState,
  useRef,
  WheelEventHandler,
  PointerEventHandler
} from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { motion, useDragControls } from 'framer-motion';
import DropPlaceholder from './DropPlaceholder';
import ItemTypes from './ItemTypes';
import BoardItem from './BoardItem';
import DragLayer from './DragLayer';

interface BoardProps {
  className?: string;
}

interface Item {
  tag: string;
  name: string;
  left: number;
  top: number;
}

const items: Item[] = [
  {
    tag: 'PPP-1234',
    name: 'Pipe Fitting',
    left: 0,
    top: 0,
  },
  {
    tag: 'PIP-2345',
    name: 'Pump',
    left: 0,
    top: 0,
  },
  {
    tag: 'SCP-3456',
    name: 'Blower',
    left: 0,
    top: 0,
  },
  {
    tag: 'SAP-4567',
    name: 'Tank',
    left: 0,
    top: 0,
  },
  {
    tag: 'CAC-5678',
    name: 'Vessel',
    left: 0,
    top: 0,
  }
];

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

  const [board, setBoard] = useState<Item[]>([]);

  const updateBoard = (item: Item) => {
    const foundItem = board.find((i) => i.tag === item.tag);

    if (foundItem === undefined) {
      board.push(item);
    } else {
      const index = board.indexOf(foundItem);
      Object.assign(foundItem, item);
      board[index] = foundItem;
    }
    setBoard(board);
  };

  const [, drop] = useDrop<Pick<Item, 'name'>>(
    () => ({
      accept: [ItemTypes.ITEM, ItemTypes.BOARD_ITEM],
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
      drop(item, monitor) {
        const itemType = monitor.getItemType();

        let foundItem;

        if (itemType === ItemTypes.ITEM) {
          foundItem = items.find((i) => i.name === item.name);
        } else {
          foundItem = board.find((i) => i.name === item.name);
        }

        if (foundItem === undefined) {
          return;
        }

        const delta = monitor.getClientOffset();

        const boardRect = boardRef.current?.getBoundingClientRect();
        if (delta && boardRect) {
          let left = delta.x - boardRect.left;
          let top = delta.y - boardRect.top;

          left /= scale;
          top /= scale;

          const initialClientOffset = monitor.getInitialClientOffset();
          const initialSourceClientOffset = monitor.getInitialSourceClientOffset();

          if (itemType === ItemTypes.BOARD_ITEM && initialClientOffset
            && initialSourceClientOffset) {
            const localOffset = {
              x: initialClientOffset.x - initialSourceClientOffset.x,
              y: initialClientOffset.y - initialSourceClientOffset.y,
            };

            left -= localOffset.x;
            top -= localOffset.y;
          }

          const newItem = update(foundItem, {
            left: { $set: left },
            top: { $set: top },
          });

          updateBoard(newItem);
          setCanDrag(true);
        }
      },
    }),
    [board, scale]
  );

  return (
    <motion.main
      className={`overflow-hidden bg-neutral-200 relative flex flex-1 justify-center items-center ${className}`}
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
