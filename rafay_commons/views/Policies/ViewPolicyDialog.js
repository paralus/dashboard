import React from "react";
import {
  Dialog,
  DialogTitle as MDialogTitle,
  DialogContent,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  makeStyles
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import * as R from "ramda";

import { longEm, isSomething } from "../../utils/helpers";

const useStyles = makeStyles(theme => ({
  title: {
    display: "inline",
    borderBottom: "2px dotted rgba(0, 0, 0, 0.3)"
  },
  value: {
    marginTop: 2
  },
  dialogTitle: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

const isEnabled = R.pipe(
  R.defaultTo(false),
  R.ifElse(R.equals("false"), R.always("Disabled"), R.always("Enabled"))
);

const getDetails = ({ fsGroup, runAsUser, supplementalGroups, seLinux }) => ({
  privileged: {
    label: "Privileged",
    title: "Running of privileged containers",
    render: isEnabled
  },
  allowPrivilegeEscalation: {
    label: "Allow Privilege Escalation",
    title:
      "Running of a container that allow privilege escalation from its parent",
    render: isEnabled
  },
  defaultAllowPrivilegeEscalation: {
    label: "Default Allow Privilege Escalation",
    title:
      "Control whether a process can gain more privileges than its parent process",
    render: isEnabled
  },
  hostPID: {
    label: "Host PID",
    title: "Use of host's PID namespace",
    render: isEnabled
  },
  hostIPC: {
    label: "Host IPC",
    title: "Use of host's IPC namespace",
    render: isEnabled
  },
  hostNetwork: {
    label: "Host Network",
    title: "Use of host networking",
    render: isEnabled
  },
  hostPorts: {
    label: "Host Ports",
    title: "Use of host ports",
    render: R.when(
      isSomething,
      R.pipe(
        R.map(({ min, max }) => `${min}-${max}`),
        R.join(", ")
      )
    )
  },
  volumes: {
    label: "Volumes",
    title: "Control the usage of volume types",
    render: R.pipe(R.defaultTo([]), R.join(", "))
  },
  fsGroup: {
    label: "FS Group",
    render: R.prop("rule"),
    title:
      fsGroup.rule === "MustRunAs"
        ? "Requires at least one range to be specified. Uses the minimum value of the first range as the default. Validates against the first ID in the first range."
        : "No default provided. Allows any fsGroup ID to be specified."
  },
  allowedHostPaths: {
    label: "Allowed Host Paths",
    title: "Whitelist of allowed host paths",
    render: R.when(isSomething, R.join(", "))
  },
  readOnlyRootFilesystem: {
    label: "Read Only Root Filesystem",
    title: "Requiring the use of a read only root file system",
    render: isEnabled
  },
  runAsUser: {
    label: "Run As User",
    render: R.prop("rule"),
    title:
      runAsUser.rule === "MustRunAs"
        ? "Requires a range to be configured. Uses the first value of the range as the default. Validates against the configured range."
        : runAsUser.rule === "MustRunAsNonRoot"
        ? "Requires that the pod be submitted with a non-zero runAsUser or have the USER directive defined in the image. No default provided."
        : "No default provided. Allows any runAsUser to be specified."
  },
  supplementalGroups: {
    label: "Supplemental Groups",
    render: R.prop("rule"),
    title:
      supplementalGroups.rule === "MustRunAs"
        ? "Requires at least one range to be specified. Uses the minimum value of the first range as the default. Validates against all ranges."
        : "No default provided. Allows any supplementalGroups to be specified."
  },
  seLinux: {
    label: "SELinux",
    render: R.prop("rule"),
    title:
      seLinux.rule === "MustRunAs"
        ? "Uses seLinuxOptions as the default. Validates against seLinuxOptions."
        : "Allows any seLinuxOptions to be specified."
  },
  allowedCapabilities: {
    label: "Allowed Capabilities"
  },
  defaultAddCapabilities: {
    label: "Default Add Capabilities"
  },
  requiredDropCapabilities: {
    label: "Required Drop Capabilities"
  }
});

function ViewItem({ label, value, title }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Tooltip
        placement="bottom-start"
        title={title ? <Typography variant="body2">{title}</Typography> : ""}
      >
        <Typography
          variant="subtitle2"
          display="block"
          className={title ? classes.title : undefined}
        >
          {label}
        </Typography>
      </Tooltip>
      <Typography variant="body2" className={classes.value}>
        {longEm(value)}
      </Typography>
    </React.Fragment>
  );
}

function DialogTitle({ children, onClose, ...other }) {
  const classes = useStyles();

  return (
    <MDialogTitle disableTypography className={classes.dialogTitle} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MDialogTitle>
  );
}

export default function ViewPolicyDialog({ open, data, pspName, onClose }) {
  const currentPsp = R.find(R.pathEq(["metadata", "name"], pspName), data);
  const spec = R.path(["spec", "template", "spec", "spec"], currentPsp);

  if (!spec) return null;

  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth="md">
      <DialogTitle onClose={onClose}>{pspName}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {R.pipe(
            getDetails,
            R.mapObjIndexed((details, key) => {
              const { label, title, render } = details;
              const value = R.prop(key, spec);

              return (
                <Grid item xs={4}>
                  <ViewItem
                    label={label}
                    title={title}
                    value={render ? render(value) : value}
                  />
                </Grid>
              );
            }),
            R.values
          )(spec)}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
