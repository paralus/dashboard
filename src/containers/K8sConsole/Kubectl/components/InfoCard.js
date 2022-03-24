import React from "react";
import { Paper, Button, CircularProgress } from "@material-ui/core";

const InfoCard = ({ open, type, reloadShell }) => {
  if (!open) return null;
  return (
    <Paper
      elevation={0}
      className={`d-flex justify-content-between align-items-center ${
        type === "error" && "bg-danger"
      } ${type === "loading" && "bg-info"}`}
      style={{
        position: "absolute",
        top: "5px",
        left: "5px",
        width: "400px",
        height: "50px",
        marginRight: "15px",
        zIndex: 3,
        paddingLeft: "15px",
        color: "white",
      }}
    >
      {type === "error" && (
        <>
          <h3 className="m-0">
            <span>Connection Error</span>
          </h3>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className="mr-3"
            onClick={reloadShell}
          >
            <i className="zmdi zmdi-refresh mr-2" />
            <span>Reconnect</span>
          </Button>
        </>
      )}
      {type === "loading" && (
        <>
          <h3 className="m-0">
            <span>Connecting ...</span>
          </h3>
          <CircularProgress className="mr-3" size={30} />
        </>
      )}
    </Paper>
  );
};

export default InfoCard;
