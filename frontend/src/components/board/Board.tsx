import React, {
  useState, useCallback, useRef, useEffect
} from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  Connection,
  NodeTypes,
  Background,
  BackgroundVariant,
  ConnectionLineType
} from 'react-flow-renderer';
import IObjectContext from '../../typings/IObjectContext';
import ItemNode from './ItemNode';

interface NewBoardProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodeClick: (node: Node) => void;
  onEdgeClick: (edge: Edge) => void;
  onEdgeUpdate?: (oldEdge: Edge, newConnection: Connection) => void;
  onNodeMove?: (node: Node) => void;
  postInitialItem: (item: Partial<IObjectContext>) => void;
  onEdgeConnect: (type: string, firstItemTag: string, secondItemTag: string) => void;
}

const nodeTypes: NodeTypes = {
  itemNode: ItemNode,
};

function Board(props: NewBoardProps) {
  const {
    initialNodes,
    initialEdges,
    onNodeClick,
    onEdgeClick,
    onNodeMove,
    postInitialItem,
    onEdgeConnect,
    onEdgeUpdate,
  } = props;

  const reactFlowWrapper = useRef<HTMLInputElement>(null);

  // State containing the nodes of the board
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  // State containing the edges of the board
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // State containing the React Flow Instance
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

  useEffect(() => {
    setNodes(initialNodes ?? []);
  }, [initialNodes]);

  useEffect(() => {
    setEdges(initialEdges ?? []);
  }, [initialEdges]);

  // Whenever a edge gets created update the edges state
  const onConnect = useCallback((params: Connection) => {
    if (!(params.source && params.target)) return;
    onEdgeConnect('pipeline', params.source, params.target);
  }, [setEdges, onEdgeConnect]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // The callback that creates the node whenever a new node is dropped on the board
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      if (!reactFlowInstance || !reactFlowWrapper || !reactFlowWrapper.current) return;

      event.preventDefault();
      // Contains information about the size of the react flow container
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const name = event.dataTransfer?.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof name === 'undefined' || !name) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const initialItem: Partial<IObjectContext> = {
        x: position.x,
        y: position.y,
        type: name,
      };

      postInitialItem(initialItem);
    },
    [reactFlowInstance, postInitialItem]
  );

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeMove) onNodeMove(node);
  }, [onNodeMove]);

  return (
    <div className="w-full h-full" data-cy="board" ref={reactFlowWrapper}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        deleteKeyCode={null}
        onNodeClick={(e, n) => onNodeClick(n)}
        onEdgeClick={(e, n) => onEdgeClick(n)}
        onEdgeUpdate={onEdgeUpdate}
        connectionLineType={ConnectionLineType.Straight}
        onNodeDragStop={(e, n) => onNodeDragStop(e, n)}
      >
        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Lines} color="#dfdfdf" gap={25} />
      </ReactFlow>
    </div>
  );
}

export default Board;
