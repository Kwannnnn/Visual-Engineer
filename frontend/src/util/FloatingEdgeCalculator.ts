import { Position, Node } from 'react-flow-renderer';

interface Coordinate {
  x: number;
  y: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNodeIntersection(intersectionNode: Node<any>, targetNode: Node<any>): Coordinate | null {
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    position: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.position;

  if (!intersectionNodeWidth
    || intersectionNodeWidth === null
    || !intersectionNodeHeight
    || intersectionNodeHeight === null) return null;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + w;
  const y1 = targetPosition.y + h;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEdgePosition(node: Node<any>, intersectionPoint: Coordinate) {
  const n = { ...node.position, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (!n.width || !n.height) {
    return null;
  }

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function getEdgeParams(source: Node<any>, target: Node<any>) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  if (sourceIntersectionPoint === null || targetIntersectionPoint === null) return null;

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  if (sourcePos === null || targetPos === null) return null;

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
