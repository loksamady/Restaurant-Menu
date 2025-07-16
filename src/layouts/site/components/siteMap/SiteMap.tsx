/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Controls,
} from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import SiteMapNode from "./SiteMapNode";
import "./siteMap.css";
import { useMemo, useState } from "react";

import RootNode from "./RootNode";
import { NavMenuType } from "@src/types/menu";

const position = { x: 0, y: 0 };
const edgeType = "smoothstep";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: any, edges: any, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const backgroundColors = [
  "bg-blue-600", // Blue
  "bg-green-600", // Green
  "bg-red-600", // Red
  "bg-purple-600", // Purple
  "bg-teal-600", // Teal
  "bg-indigo-600", // Indigo
  "bg-yellow-700", // Yellow (darker shade for readability)
  "bg-pink-600", // Pink
  "bg-orange-600", // Orange
  "bg-gray-800", // Dark Gray
];

const borderColors = [
  "border-t-blue-600", // Blue
  "border-t-green-600", // Green
  "border-t-red-600", // Red
  "border-t-purple-600", // Purple
  "border-t-teal-600", // Teal
  "border-t-indigo-600", // Indigo
  "border-t-yellow-700", // Yellow (darker shade for readability)
  "border-t-pink-600", // Pink
  "border-t-orange-600", // Orange
  "border-t-gray-800", // Dark Gray
];

type Props = {
  items: NavMenuType[];
  setVisible: (visible: boolean) => void;
};

const SiteMap = ({ items, setVisible }: Props) => {
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [
      { id: "99999", type: "rootNode", data: { label: "DEVSHPERE" }, position },
    ];
    const initialEdges: Edge[] = [];
    items.forEach((item, index) => {
      nodes.push({
        id: item.id!,
        type: "node",
        data: {
          isOutSourceUrl: item.isOutSourceUrl,
          label: item.label,
          url: item.url,
          items: item.items,
          color: backgroundColors[index] ?? backgroundColors[0],
          borderColor: borderColors[index] ?? borderColors[0],
          setVisible,
        },
        position,
      });

      initialEdges.push({
        id: `${nodes[0].id}${item.id}`,
        source: nodes[0].id,
        target: item.id!,
        type: edgeType,
        animated: false,
      });
    });
    return { initialNodes: nodes, initialEdges };
  }, [position, items]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
  );

  const [nodes] = useNodesState(layoutedNodes);

  const [edges] = useEdgesState(layoutedEdges);

  const nodeTypes = { node: SiteMapNode, rootNode: RootNode };

  const [isDraggable] = useState(false);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodesDraggable={isDraggable}
      fitView
      attributionPosition="top-right"
      nodeTypes={nodeTypes}
      proOptions={{ hideAttribution: true }}
    >
      <Controls />
    </ReactFlow>
  );
};

export default SiteMap;
