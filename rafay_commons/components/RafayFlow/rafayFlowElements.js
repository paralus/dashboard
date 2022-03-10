import React from "react";
import AdjustIcon from "@material-ui/icons/Adjust";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const rafayFlowElements = (
  stages = [],
  onEdgeIconClick,
  Stage,
  onStageEdit,
  onStageDelete,
  goToGitRepo,
  ...rest
) => {
  if (!stages.length) {
    return [];
  }
  const { yPosition = 65 } = rest;
  const cardHeight = `${2.45 * yPosition}px`;
  let currentX = 0;
  const elements = [
    {
      id: "start",
      type: "input",
      sourcePosition: "right",
      connectable: false,
      selectable: false,
      className: "corner-node",
      data: {
        label: (
          <FiberManualRecordIcon fontSize="small" className="flow-start-icon" />
        )
      },
      position: { x: currentX, y: yPosition }
    }
  ];

  const edges = new Array(stages.length + 1).fill({
    source: "",
    target: ""
  });

  stages.forEach((res, index) => {
    if (index === 0) {
      currentX += Math.floor(350 / 2);
    } else {
      currentX += 350;
    }
    elements.push({
      id: res.name,
      type: "default",
      targetPosition: "left",
      sourcePosition: "right",
      className: "default-node",
      connectable: false,
      selectable: false,
      data: {
        label: (
          <Stage
            config={res}
            index={index}
            onEdit={onStageEdit}
            onDelete={onStageDelete}
            goToGitRepo={goToGitRepo}
            cardHeight={cardHeight}
          />
        )
      },
      position: { x: currentX, y: 0 }
    });
  });

  edges.forEach((_, i) => {
    if (i === 0) {
      elements.push({
        id: `from-start-to-${stages[i]?.name}`,
        type: "buttonedge",
        source: "start",
        arrowHeadType: "arrow",
        target: stages[i]?.name,
        data: {
          onEdgeIconClick,
          index: i
        }
      });
    } else if (i === stages.length) {
      elements.push({
        id: `from-${stages[i - 1]?.name}-to-end`,
        type: "buttonedge",
        source: stages[i - 1]?.name,
        target: "end",
        arrowHeadType: "arrow",
        data: {
          onEdgeIconClick,
          index: i
        }
      });
    } else {
      elements.push({
        id: `from-${stages[i - 1]?.name}-to-${stages[i]?.name}`,
        type: "buttonedge",
        source: stages[i - 1]?.name,
        target: stages[i]?.name,
        arrowHeadType: "arrow",
        data: {
          onEdgeIconClick,
          index: i
        }
      });
    }
  });
  currentX += 350;
  elements.push({
    id: "end",
    type: "output",
    draggable: true,
    targetPosition: "left",
    connectable: false,
    selectable: false,
    className: "corner-node",
    data: {
      label: <AdjustIcon fontSize="small" className="flow-end-icon" />
    },
    position: { x: currentX, y: yPosition }
  });
  return elements;
};

export default rafayFlowElements;
