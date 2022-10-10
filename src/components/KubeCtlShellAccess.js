import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openKubectlDrawer, closeKubectlDrawer } from "actions/index";
import { makeStyles, Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  icon: {
    display: "inline",
    border: "2px solid #757575",
    borderTop: "5px solid #757575",
    paddingLeft: "3px",
    paddingRight: "3px",
    color: "#757575",
    fontSize: "14px",
    borderRadius: "2px",
    marginRight: "5px",
    marginTop: "4px",
    lineHeight: "10px",
    height: "20px",
  },
  label: {
    marginTop: "4px",
    fontWeight: "500",
    cursor: "pointer",
    marginLeft: "2px",
  },
  root: {
    marginTop: 12,
  },
  hover: {
    cursor: "pointer",
  },
}));

function KubeCtlShellAccess({ projectId, clusterName, iconOnly }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const KubectlConfig = useSelector((s) => s.Kubectl?.kubectlConfig);
  const handleOpenKubectl = () => {
    dispatch(closeKubectlDrawer());
    setTimeout(() => dispatch(openKubectlDrawer(projectId, clusterName)), 500);
  };
  if (KubectlConfig?.disableWebKubectl) return null;

  if (iconOnly) {
    return (
      <Tooltip title="Web Kubectl">
        <div className={`text-teal d-flex ml-4 ${classes.root}`}>
          <div
            onClick={handleOpenKubectl}
            className={`${classes.icon} ${classes.hover}`}
          >
            {">_"}
          </div>
        </div>
      </Tooltip>
    );
  }
  return (
    <div className={`text-teal d-flex ml-4 ${classes.root}`}>
      <div className={classes.icon}>{">_"}</div>
      <div onClick={handleOpenKubectl} className={classes.label}>
        KUBECTL
      </div>
    </div>
  );
}

export default KubeCtlShellAccess;
