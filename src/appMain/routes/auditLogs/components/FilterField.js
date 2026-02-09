import React from "react";
import TextField from "@material-ui/core/TextField";
import { MenuItem } from "@material-ui/core";

const styleText = { color: "#009688", fontSize: "medium" };

function FilterField({
  name,
  list,
  value,
  label,
  optionValue = "key",
  optionLabel = "key",
  hideAllOption,
  defaultLabel,
  defaultValue = "_ALL_",
  handleFilter,
}) {
  // if (!list || list?.length === 0) return null;
  const hasOptions = Array.isArray(list) && list.length > 0;
  return (
    <TextField
      select
      fullWidth
      disabled={!hasOptions}
      margin="normal"
      className="float-right"
      id={`event_${name}_filter`}
      name={name}
      label={label}
      value={value || defaultValue}
      defaultValue={defaultValue}
      onChange={handleFilter}
      style={{
        marginTop: "8px",
        width: "100%",
        ...styleText,
      }}
      InputProps={{
        disableUnderline: true,
      }}
    >
      {!hideAllOption && (
        <MenuItem key={0} value="_ALL_" style={styleText}>
          <span style={styleText}>{defaultLabel}</span>
        </MenuItem>
      )}
      {hasOptions ? (
        list.map((option) => (
          <MenuItem
            key={option?.[optionValue]}
            value={option?.[optionValue]}
            style={styleText}
          >
            <span style={styleText}>{option?.[optionLabel]}</span>
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>
          <span style={{ ...styleText, opacity: 0.6 }}>
            No projects available
          </span>
        </MenuItem>
      )}
    </TextField>
  );
}
export default FilterField;
