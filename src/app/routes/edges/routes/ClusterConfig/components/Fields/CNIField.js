import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const CNIField = ({ edge, handleEdgeChange, cniList, disabled }) => {
  return (
    <div className="row mt-2">
      <div className="col-md-12">
        <TextField
          select
          margin="dense"
          id="os"
          name="os"
          required
          disabled={disabled}
          value={edge.cni_provider || ""}
          label="CNI Providers"
          onChange={handleEdgeChange("cni_provider")}
          fullWidth
        >
          {cniList?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </div>
  );
};

export default CNIField;
