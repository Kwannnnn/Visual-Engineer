import React, { useCallback } from 'react';
import {
  useStore, EdgeText, getEdgeCenter
} from 'react-flow-renderer';
import { FloatingEdgeProps } from './FloatingEdge.type.js';
import getEdgeParams from '../../../util/FloatingEdgeCalculator';

function FloatingEdge(props: FloatingEdgeProps) {
  const {
    id, source, target, markerEnd, style, data, markerStart,
  } = props;
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode || !data) {
    return null;
  }

  const edgeParams = getEdgeParams(sourceNode, targetNode);

  if (edgeParams === null) return null;

  const path = `M ${edgeParams.sx},${edgeParams.sy}L ${edgeParams.tx},${edgeParams.ty}`;

  const center = getEdgeCenter({
    sourceX: edgeParams.sx,
    sourceY: edgeParams.sy,
    targetX: edgeParams.tx,
    targetY: edgeParams.ty,
  });

  return (
    <>
      <path style={style} d={path} className="react-flow__edge-path" markerStart={markerStart} markerEnd={markerEnd} />
      <EdgeText
        x={center[0]}
        y={center[1]}
        label={data.tag}
        className="hover:cursor-pointer"
      />
    </>
  );
}

export default FloatingEdge;
