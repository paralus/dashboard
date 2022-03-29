import React from "react";
import { Paper, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

const Footer = ({ name }) => {
  const drawerType = useSelector((s) => s.settings.drawerType);
  const history = useHistory();
  const handleExit = (edge) => {
    history.push(`/app/edges${edge ? `/${name}` : ""}`);
  };

  return (
    <Paper
      className={`nav-footer ${drawerType}`}
      style={{ height: "60px" }}
      elevation={10}
    >
      <div className="d-flex justify-content-between h-100 p-0">
        <div />
        <div className="d-flex align-items-center">
          <Button
            variant="contained"
            className="mr-3"
            onClick={(_) => handleExit(false)}
          >
            <span>Exit</span>
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="mr-3"
            onClick={(_) => handleExit(true)}
            endIcon={<ArrowRightAltIcon />}
          >
            <span>Go To Cluster</span>
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default Footer;
