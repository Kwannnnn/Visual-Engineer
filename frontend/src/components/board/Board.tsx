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
  onDropNodeHandler?: (node: Node) => void;
  onNodeClick: (node: Node) => void;
  onEdgesDelete: (edge: Edge[]) => void;
  onEdgeClick: (edge: Edge) => void;
  onEdgeUpdate?: (oldEdge: Edge, newConnection: Connection) => void;
  onNodeMove?: (node: Node) => void;
  onEdgeConnect: (type: string, firstItemTag: string, secondItemTag: string) => void;
  postItem: (item: Partial<IObjectContext>) => Promise<Partial<IObjectContext>>;
}

// This string key must match the key in the nodeTypes object in order to render the correct
// custom node. Otherwise a default node will be rendered.
const NODE_TYPE = 'itemNode';
const nodeTypes: NodeTypes = {
  itemNode: ItemNode,
};

function Board(props: NewBoardProps) {
  const {
    initialNodes,
    initialEdges,
    onDropNodeHandler,
    onNodeClick,
    onEdgeClick,
    onEdgesDelete,
    onNodeMove,
    postItem,
    onEdgeUpdate,
    onEdgeConnect,
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

  // Whenever an edge gets created make the API request from the Home page
  const onConnect = useCallback((params: Connection) => {
    if (!(params.source && params.target)) return;
    onEdgeConnect('pipeline', params.source, params.target);
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // The callback that creates the node whenever a new node is dropped on the board
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      // TODO: improve those null checks
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
      postItem(initialItem).then((item) => { // onFullfilled
        const newNode = {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: item.tag!,
          type: NODE_TYPE,
          position,
          data: {
            type: name,
            tag: item.tag,
            dataCY: `itemNode-${item.tag}`,
          },
        };

        setNodes((nodesState) => nodesState.concat(newNode));
        if (onDropNodeHandler) onDropNodeHandler(newNode);
      }, () => { // onRejected

      });
    },
    [reactFlowInstance]
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
        onEdgesDelete={(ed) => onEdgesDelete(ed)}
        onEdgeUpdate={onEdgeUpdate}
        fitView
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
