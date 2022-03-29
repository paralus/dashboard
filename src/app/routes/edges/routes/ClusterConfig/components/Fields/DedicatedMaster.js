import React from "react";
import { Paper, FormControlLabel, Checkbox } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";

const DedicatedMaster = (props) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name="Dedicated Master"
          checked={props.edge.is_master_dedicated}
          onChange={props.handleEdgeChange("is_master_dedicated")}
          color="primary"
        />
      }
      label="Dedicated Master" // {sc}
      // key={index}
    />
  );
};

export default DedicatedMaster;
