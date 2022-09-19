import React, { useState } from "react";
import { Paper, Button, makeStyles } from "@material-ui/core";
import Moment from "moment";
import ResourceDialog from "components/ResourceDialog";

const useStyles = makeStyles((theme) => ({
  healthy: {
    boxShadow: "rgb(145, 239, 149) 1px 1px 10px 1px",
    backgroundColor: "#91ef9569",
    fontSize: "smaller",
    marginRight: "8px",
  },
  unhealthy: {
    boxShadow: "rgb(255, 195, 191) 1px 1px 10px 1px",
    backgroundColor: "#ff00001f",
    fontSize: "smaller",
    marginRight: "8px",
  },
  checkIn: {
    marginLeft: "10px",
    color: "grey",
    fontSize: "smaller",
  },
  statusUnhealthy: { fontWeight: "initial", color: "gray" },
  pointer: { cursor: "pointer" },
  open: {
    marginLeft: "5px",
    color: "teal",
    fontSize: "medium",
    position: "absolute",
    marginTop: "2px",
  },
}));

const getStatus = (status) => {
  if (!status) {
    return <span className="text-grey">{status}</span>;
  }
  if (status.includes("FAIL")) {
    return <span className="text-red">{status}</span>;
  }
  return <span className="text-teal">{status}</span>;
};

const CardField = ({ label, value }) => {
  return (
    <div>
      <span className="mr-2 fontWeight500">{label}</span>
      <span className="">{value}</span>
    </div>
  );
};

const ClusterHeaderImported = (props) => {
  const classes = useStyles();
  const { edge, status } = props;
  const [open, setOpen] = useState(false);
  if (!edge) return null;
  const isClusterRegistered = status?.ClusterRegister === "Success";

  return (
    <Paper className="row py-3 mx-0 mb-2">
      <div className="col-md-6">
        <h2 className="text-teal">{edge.metadata.name}</h2>

        <div>
          Status :&nbsp;
          {edge && (
            <span className="mr-4">{getStatus(status?.ClusterRegister)}</span>
          )}
          {status?.ClusterRegister === "Success" && (
            <span className="ml-4">
              {status?.ClusterReady === "Success" ? (
                <span>
                  <i
                    className={`zmdi zmdi-circle zmdi-hc-2x text-success ${classes.healthy}`}
                  />
                  Healthy
                </span>
              ) : (
                <span>
                  <i
                    className={`zmdi zmdi-circle zmdi-hc-2x text-danger ${classes.unhealthy}`}
                  />
                  {status.reasons ? (
                    <ResourceDialog
                      message={
                        <span>
                          Reason :&nbsp;
                          {status.reasons}
                        </span>
                      }
                      heading={
                        <span>
                          Status :&nbsp;
                          <span className={classes.statusUnhealthy}>
                            Unhealthy
                          </span>
                        </span>
                      }
                    >
                      <span className={classes.pointer}>
                        Unhealthy
                        <i
                          className={`zmdi zmdi-open-in-new ${classes.open}`}
                        />
                      </span>
                    </ResourceDialog>
                  ) : (
                    "Unhealthy"
                  )}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              )}
              <span className={classes.checkIn}>
                Last check in &nbsp;
                {Moment(edge.health_status_modified_at).fromNow()}
              </span>
            </span>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default ClusterHeaderImported;
