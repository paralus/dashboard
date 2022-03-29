import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((_) => ({
  deleteIcon: { cursor: "pointer" },
}));

const GenericArrayTextField = (props) => {
  const classes = useStyles();
  return (
    <Paper className="row my-3 mx-0">
      <h4 className="col-md-12 mb-0 mt-2">{props.label}</h4>
      {props.help && (
        <div className="col-md-12 text-muted font-italic">{props.help}</div>
      )}
      <div className="col-md-12">
        {props.valueList.map((value, index) => (
          <div className="d-flex justify-content-between" key={index}>
            <TextField
              variant={props.variant || "standard"}
              margin="dense"
              className="mr-3"
              id={`id-${props.name}`}
              name={`${props.name}`}
              value={value}
              key={`node_zones-${index}`}
              onChange={(e) => props.handleArrayChange(e.target.value, index)}
              disabled={props.isEdit}
              fullWidth
            />
            <div className="pt-3">
              {!props.isEdit && (
                <i
                  className={`zmdi zmdi-delete zmdi-hc-2x ${classes.deleteIcon}`}
                  onClick={(_) => props.handleRemove(index)}
                />
              )}
            </div>
          </div>
        ))}
        {!props.isEdit && (
          <Button
            className="my-2 pl-0"
            color="primary"
            onClick={props.handleAdd}
          >
            <i className="zmdi zmdi-plus zmdi-hc-fw " />
            <span>
              Add &nbsp;
              {props.addLabel}
            </span>
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default GenericArrayTextField;
