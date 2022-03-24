import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Paper, MenuItem, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((_) => ({
  deleteIcon: { cursor: "pointer" },
}));

const GenericArraySelectField = ({
  label,
  name,
  valueList,
  itemsList,
  handleItemChange,
  handleAddItem,
  addLabel,
  handleRemoveItem,
  disabled = false,
  disabledAddBtn = false,
  shouldDisableAfterSet = false,
}) => {
  const classes = useStyles();
  if (!valueList) return null;
  return (
    <Paper className="row my-3 mx-0">
      <h4 className="col-md-12 mb-0 mt-2">{label}</h4>
      <div className="col-md-12">
        {valueList.map((value, index) => (
          <div className="row" key={index}>
            <div className="col-md-12 d-flex">
              <TextField
                select
                margin="dense"
                id={`id-${name}`}
                name={`${name}`}
                value={value}
                key={`node_zones-${index}`}
                onChange={(e) => handleItemChange(e.target.value, index)}
                disabled={(shouldDisableAfterSet && value.length) || disabled}
                fullWidth
              >
                {itemsList.map((option, i) => (
                  <MenuItem
                    key={i}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <div className="ml-3 pt-3">
                {!disabled && (
                  <i
                    className={`zmdi zmdi-delete zmdi-hc-2x ${classes.deleteIcon}`}
                    onClick={(_) => handleRemoveItem(index)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        {!disabled && (
          <Button
            className="my-2 pl-0"
            color="primary"
            disabled={disabledAddBtn}
            onClick={handleAddItem}
          >
            <i className="zmdi zmdi-plus zmdi-hc-fw " />
            <span>
              Add &nbsp;
              {addLabel}
            </span>
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default GenericArraySelectField;
