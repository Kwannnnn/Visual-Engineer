import { Edge } from 'react-flow-renderer';
import IObjectContext from '../typings/IObjectContext';
import IOConnectionContext from '../typings/IOConnectionContext';

export default function transformConnectionToEdge(allEdges: Partial<IOConnectionContext>[], allObjects: Partial<IObjectContext>[] | null) : Edge[] {
  const edges: Edge[] = [];
  if (!allObjects) return edges;

  allEdges.forEach((object, i) => {
    const {
      pipeline, firstItem, secondItem,
    } = object;

    const pipelineObject = allObjects.find((item) => item.tag === pipeline);
    if (!pipelineObject) return;

    if (!(pipeline && firstItem && secondItem)) return;

    const edge: Edge = {
      id: pipeline,
      source: firstItem,
      target: secondItem,
      label: pipeline,
      type: 'floating',
      labelStyle: { cursor: 'pointer' },
      labelBgStyle: { cursor: 'pointer' },
      style: { cursor: 'pointer', strokeWidth: 3, stroke: '#000' },
      data: { ...pipelineObject },
      // Used for cypress test
      className: `itemEdge_${i}`,
    };
    edges.push(edge);
  });

  return edges;
}
