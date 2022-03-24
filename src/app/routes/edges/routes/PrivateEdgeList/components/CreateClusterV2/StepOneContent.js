import React from "react";
import { Paper, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((_) => ({
  paper: {
    cursor: "pointer",
    padding: "20px",
    margin: "10px",
    backgroundColor: "whitesmoke",
    border: "5px solid rgb(10, 176, 155, 0)",
  },
  paperSelected: {
    cursor: "pointer",
    padding: "20px",
    margin: "10px",
    backgroundColor: "white",
    border: "5px solid rgb(10, 176, 155)",
  },
  label: {
    fontWeight: "500",
    fontSize: "16px",
  },
  typeHeading: { color: "black", marginBottom: "5px" },
  typeHelptext: {
    fontStyle: "italic",
    color: "rgb(117, 117, 117)",
    fontSize: "14px",
    marginBottom: "6px",
  },
  typeImage: {
    width: "30px",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "10px",
    display: "block",
  },
  paperDisabled: {
    cursor: "not-allowed",
    padding: "10px",
    margin: "10px",
    textAlign: "center",
    opacity: "0.5",
    backgroundColor: "whitesmoke",
    height: "80px",
    width: "180px",
    fontWeight: "500",
    fontSize: "13px",
    border: "3px solid rgb(10, 176, 155, 0)",
  },
}));

const ClusterTypeButton = ({
  label,
  helptext,
  icon,
  type,
  clusterType,
  onTypeSelect,
}) => {
  const classes = useStyles();
  return (
    <Paper
      elevation={1}
      onClick={(_) => onTypeSelect(type)}
      className={clusterType === type ? classes.paperSelected : classes.paper}
    >
      <Grid className="d-flex flex-row">
        <Grid item className="mr-2">
          {icon}
        </Grid>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <span className={classes.label}>{label}</span>
            </Grid>
            <Grid item>
              <span className={classes.typeHelptext}>{helptext}</span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const StepOneContent = ({ type, onTypeSelect }) => {
  const classes = useStyles();
  return (
    <div className="py-3">
      <div className="row">
        <div className="col-md-12 mb-4">
          <h3 className={classes.typeHeading}>Import a Cluster</h3>
          <p className={classes.typeHelptext}>
            Use this to bring an existing Kubernetes cluster for Zero Trust
            Access
          </p>
        </div>
      </div>
      <div className="row mb-2">
        <div className="offset-md-3 col-md-6 d-flex flex-column">
          <ClusterTypeButton
            type="IMPORT"
            clusterType={type}
            onTypeSelect={onTypeSelect.IMPORT}
            label="Import Existing Kubernetes Cluster"
            helptext="Deploy the Kubernetes Operator on an existing Kubernetes cluster"
            icon={<i className="zmdi zmdi-upload zmdi-hc-2x mr-2" />}
          />
        </div>
      </div>
    </div>
  );
};

export default StepOneContent;
