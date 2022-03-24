import React from "react";
import { Popover } from "@material-ui/core";
import ClusterList from "./ClusterList";

const SelectCluster = ({
  open,
  anchor,
  height,
  tabs,
  handleClose,
  handleOpenTab,
}) => {
  return (
    <div>
      <Popover
        id="cluster-list-popover"
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
      >
        <ClusterList
          handleClose={handleClose}
          height={height}
          tabs={tabs}
          handleOpenTab={handleOpenTab}
        />
      </Popover>
    </div>
  );
};

export default SelectCluster;
