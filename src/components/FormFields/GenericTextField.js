import React from "react";
import TextField from "@material-ui/core/TextField";

const GenericTextField = (props) => {
  return (
    <TextField
      margin="dense"
      error={props.error}
      helperText={props.helperText}
      required={props.required}
      id={`id-${props.name}`}
      name={`${props.name}`}
      disabled={props.disabled}
      value={props.value}
      label={props.label}
      onChange={props.onChange}
      type={props.type}
      fullWidth
      // validators={['required', 'matchRegexp:^[A-Za-z0-9_-]*$', 'maxStringLength30']}
      // errorMessages={['Name is required.', 'Valid characters are A-Za-z0-9_-', 'Maximum length allowed is 30']}
    />
  );
};

export default GenericTextField;
