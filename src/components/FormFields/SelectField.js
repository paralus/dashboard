import React from "react";
import { TextField, MenuItem, ListItemText } from "@material-ui/core";

const SelectField = ({
  items = [],
  value,
  label,
  required = false,
  disabled = false,
  onChange,
  error,
  helperText,
}) => {
  return (
    <TextField
      select
      margin="dense"
      id={label}
      name={label}
      required={required}
      disabled={disabled}
      value={value}
      label={label}
      onChange={onChange}
      fullWidth
      error={error}
      helperText={error && helperText}
    >
      {items.map((option, index) => (
        <MenuItem key={index} value={option.value} disabled={option.disabled}>
          <ListItemText
            className="my-0"
            primary={option.label}
            secondary={option.secondary}
          />
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectField;
