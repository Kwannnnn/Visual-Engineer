import React, {
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  Connection,
  NodeTypes,
  Background
} from 'react-flow-renderer';
import ItemNode from './ItemNode';

interface NewBoardProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onDropNodeHandler?: (node: Node) => void;
  onNodeClick: (node: Node) => void;
  onNodesDelete: (node: Node[]) => void;
}

// This string key must match the key in the nodeTypes object in order to render the correct
// custom node. Otherwise a default node will be rendered.
const NODE_TYPE = 'itemNode';
const nodeTypes: NodeTypes = {
  itemNode: ItemNode,
};

let id = 0;
// Every node must have an unique id
const getId = () => {
  const result = `itemNode_${id}`;
  id += 1;
  return result;
};

function NewBoard(props: NewBoardProps) {
  const {
    initialNodes, initialEdges, onDropNodeHandler, onNodeClick, onNodesDelete,
  } = props;

  const reactFlowWrapper = useRef<HTMLInputElement>(null);
  // State containing the nodes of the board

  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  // State containing the edges of the board
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges ?? []);
  // State containing the React Flow Instance
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();

  useEffect(() => {
    setNodes(initialNodes ?? []);
  }, [initialNodes]);

  // Whenever a edge gets created update the edges state
  // eslint-disable-next-line max-len
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
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
      const newNode = {
        id: getId(),
        type: NODE_TYPE,
        position,
        data: {
          type: name,
          dataCY: getId(),
        },
      };

      setNodes((nodesState) => nodesState.concat(newNode));
      if (onDropNodeHandler) onDropNodeHandler(newNode);
    },
    [reactFlowInstance]
  );

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
        onNodeClick={(e: React.MouseEvent, n: Node) => onNodeClick(n)}
        onNodesDelete={(nd) => onNodesDelete(nd)}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default NewBoard;
