import React from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@material-ui/core";

const RadioField = ({
  name,
  value,
  required,
  className,
  items,
  disabled,
  onChange,
  error,
}) => {
  return (
    <div className={className}>
      <FormControl
        component="fieldset"
        required={required}
        disabled={disabled}
        error={error}
      >
        {name && (
          <FormLabel component="legend" className="mb-0">
            {name}
          </FormLabel>
        )}
        <RadioGroup
          // disabled={disabled}
          className="d-flex flex-row"
          name={name}
          value={value}
          onChange={onChange}
        >
          {items?.map((item, index) => {
            return (
              <FormControlLabel
                key={index}
                value={item.value}
                control={
                  <Radio color="primary" disabled={item.disabled || disabled} />
                }
                label={item.label}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default RadioField;
