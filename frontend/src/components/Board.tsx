import React, {
  PointerEventHandler,
  useRef, useState, WheelEventHandler
} from 'react';
import { motion, useDragControls } from 'framer-motion';

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

  const startDrag: PointerEventHandler<HTMLDivElement> = (event) => {
    dragControls.start(event, { snapToCursor: false });
  };

  const handleScaleScroll:WheelEventHandler<HTMLDivElement> = (e) => {
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

  return (
    <motion.main
      className={`overflow-hidden bg-gray-200 relative flex justify-center items-center ${className}`}
      onWheel={handleScaleScroll}
      onPointerDown={startDrag}
      ref={constraintsRef}
    >
      <motion.div
        ref={boardRef}
        className="bg-white"
        animate={{ scale }}
        style={{
          width: '85%',
          aspectRatio: ASPECT_RATIO.toString(),
        }}
        drag
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
      />
    </motion.main>
  );
}

export default Board;
