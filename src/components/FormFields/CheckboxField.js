import React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

const CheckboxField = ({ checked, label, disabled, onChange }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name={label}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          color="primary"
        />
      }
      label={label}
    />
  );
};

export default CheckboxField;
