import React from "react";
import { Tooltip, Typography } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

export function ZoomTooltip() {
  return (
    <Tooltip
      title={
        <Typography variant="caption">
          Click and drag on chart to zoom.
        </Typography>
      }
    >
      <InfoOutlinedIcon fontSize="small" style={{ marginLeft: 8 }} />
    </Tooltip>
  );
}

export function ContainerDropDownTooltip() {
  return (
    <Tooltip
      title={
        <Typography variant="caption">
          Click on title to switch between conatiners
        </Typography>
      }
    >
      <InfoOutlinedIcon fontSize="small" style={{ marginLeft: 8 }} />
    </Tooltip>
  );
}
