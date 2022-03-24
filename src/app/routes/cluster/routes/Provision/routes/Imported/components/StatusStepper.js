import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepConnector from "@material-ui/core/StepConnector";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 136deg, #a0e9e0 0%, #12b39f 50%, #12b39f 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 136deg, #a0e9e0 0%, #12b39f 50%, #12b39f 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  rootFailed: {
    backgroundColor: "red",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage: "radial-gradient(white 48%, #019688 82%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage: "linear-gradient(315deg, #0fefe1 0%, #06b397 74%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {props.icon}
    </div>
  );
}

function ColorlibFailedStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  return <div className={classes.rootFailed}>{props.icon}</div>;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps(statusObj) {
  const pendingIcon = <i className="zmdi zmdi-refresh zmdi-hc-2x text-grey" />;
  const inprogressIcon = (
    <i className="zmdi zmdi-refresh zmdi-hc-2x zmdi-hc-spin text-teal" />
  );
  const successIcon = <i className="zmdi zmdi-check zmdi-hc-2x text-white" />;
  const failedIcon = <i className="zmdi zmdi-close zmdi-hc-2x text-white" />;

  const steps = ["ClusterRegister", "ClusterCheckIn"].map((condition) => {
    const suffix = {
      ClusterRegister: "Registration",
      ClusterCheckIn: "CheckIn",
    }[condition];

    return {
      Pending: {
        icon: pendingIcon,
        label: <span>{`${suffix} Pending`}</span>,
      },
      InProgress: {
        icon: inprogressIcon,
        label: <span>{`${suffix} InProgress`}</span>,
      },
      Success: {
        icon: successIcon,
        label: <span>{`${suffix} Complete`}</span>,
      },
      Failed: {
        icon: failedIcon,
        label: <span>{`${suffix} Failed`}</span>,
        failed: true,
      },
    }[statusObj[condition]];
  });

  return steps;
}

export default function StatusStepper({ statusObj }) {
  const classes = useStyles();
  const steps = getSteps(statusObj);

  let activeStep = 0;
  if (statusObj.ClusterRegister === "Success") activeStep = 1;
  if (statusObj.ClusterCheckIn === "Success") activeStep = 2;

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((step, idx) => (
          <Step key={idx}>
            <StepLabel
              icon={step.icon}
              idx={idx}
              StepIconComponent={
                step.failed ? ColorlibFailedStepIcon : ColorlibStepIcon
              }
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
