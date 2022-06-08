import { Node } from 'react-flow-renderer';
import IObjectContext from '../typings/IObjectContext';

export default function transformObjectToNode(objects: Partial<IObjectContext>[]) : Node[] {
  const nodes: Node[] = [];

  objects.forEach((object, i) => {
    const {
      tag, type, x, y,
    } = object;
    if (!(tag && type && x && y)) return;

    const node: Node = {
      id: tag,
      type: 'itemNode',
      data: { dataCY: `itemNode-${i}`, type, ...object },
      position: { x, y },
    };
    nodes.push(node);
  });

  return nodes;
}
