import { Edge } from 'react-flow-renderer';
import IOConnectionContext from '../typings/IOConnectionContext';

export default function transformConnectionToEdge(objects: Partial<IOConnectionContext>[]) : Edge[] {
  const edges: Edge[] = [];

  objects.forEach((object) => {
    const {
      pipeline, firstItem, secondItem,
    } = object;
    if (!(pipeline && firstItem && secondItem)) return;

    const edge: Edge = {
      id: pipeline,
      source: firstItem,
      target: secondItem,
      label: pipeline,
      type: 'straight',
      labelStyle: { cursor: 'pointer' },
      labelBgStyle: { cursor: 'pointer' },
      style: { cursor: 'pointer', strokeWidth: 3, stroke: '#000' },
    };
    edges.push(edge);
  });

  return edges;
}
