import React from "react";
import { TextField, MenuItem } from "@material-ui/core";

const GenericSelectField = ({
  items = [],
  value,
  label,
  required = false,
  disabled = false,
  onChange,
  error,
  helperText,
  name,
}) => {
  return (
    <TextField
      select
      margin="dense"
      id={label}
      name={name}
      required={required}
      disabled={disabled}
      value={value}
      label={label}
      onChange={onChange}
      fullWidth
      error={error}
      helperText={error && helperText}
    >
      {items.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default GenericSelectField;
