import React, { useEffect, useRef, useState } from "react";
import ReactFlow, {
  removeElements,
  MiniMap,
  Controls,
  Background
} from "react-flow-renderer";
import rafayFlowElements from "./rafayFlowElements";
import ButtonEdge from "./ButtonEdge";
import "../../styles/index.scss";

const RafayFlow = ({
  stages,
  onEdgeIconClick,
  Stage,
  height = 550,
  isShowMiniMap = false,
  isShowBackground = false,
  isShowControl = false,
  onStageEdit,
  onStageDelete,
  goToGitRepo
}) => {
  const initialElements = rafayFlowElements(
    stages,
    onEdgeIconClick,
    Stage,
    onStageEdit,
    onStageDelete,
    goToGitRepo
  );

  const [elements, setElements] = useState(initialElements);
  const reactFlowInstanceRef = useRef(null);
  const initialElementsRef = useRef(initialElements);

  const edgeTypes = {
    buttonedge: ButtonEdge
  };

  const onLoad = reactFlowInstance => {
    reactFlowInstanceRef.current = reactFlowInstance;
  };

  const onElementsRemove = elementsToRemove => {
    setElements(els => removeElements(elementsToRemove, els));
  };

  useEffect(() => {
    initialElementsRef.current = initialElements;
    setElements(initialElementsRef.current);
  }, [stages]);

  useEffect(() => {
    if (reactFlowInstanceRef.current) {
      reactFlowInstanceRef.current.fitView();
    }
  }, [reactFlowInstanceRef.current, elements]);

  return (
    <div style={{ height }}>
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onLoad={onLoad}
        snapToGrid={false}
        snapGrid={[15, 15]}
        edgeTypes={edgeTypes}
      >
        {isShowMiniMap && (
          <MiniMap
            nodeStrokeColor={n => {
              if (n.style?.background) return n.style.background;
              if (n.type === "input") return "#0041d0";
              if (n.type === "output") return "#ff0072";
              if (n.type === "default") return "#1a192b";

              return "#eee";
            }}
            nodeColor={n => {
              if (n.style?.background) return n.style.background;

              return "#fff";
            }}
            nodeBorderRadius={2}
          />
        )}
        {isShowControl && <Controls showInteractive={false} />}
        {isShowBackground && <Background />}
      </ReactFlow>
    </div>
  );
};

export default RafayFlow;
