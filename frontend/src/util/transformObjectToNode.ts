import { Node } from 'react-flow-renderer';
import IObjectContext from '../typings/IObjectContext';

export default function transformObjectToNode(objects: Partial<IObjectContext>[]) : Node[] {
  const nodes: Node[] = [];

  objects.forEach((object) => {
    const {
      id, type, x, y,
    } = object;
    if (!(id && type && x && y)) return;
    if (type === 'pipeline') return;

    const node: Node = {
      id,
      type: 'itemNode',
      data: { dataCY: `itemNode-${id}`, type, ...object },
      position: { x, y },
    };
    nodes.push(node);
  });

  return nodes;
}
