import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Slider from "@material-ui/core/Slider";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import Select from "react-select";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialog: {
    height: "70%",
    width: "70%",
    maxWidth: "unset",
  },
  timeControls: {
    display: "grid",
    gridTemplateColumns: "250px 1fr 0px",
    gridColumnGap: "20px",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  flex: {
    flex: 1,
  },
  dialogChildren: {
    position: "absolute",
    width: "calc(100% - 32px)",
    height: "calc(100% - 70px)",
  },
});

const durationOptions = [
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: 0,
    position: "relative",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
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
    </MuiDialogTitle>
  );
});

const ValueLabel = withStyles(styles)(({ children, open, value, classes }) => {
  const date = moment(value).format("MMM DD YYYY, HH:mm");
  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={date}>
      {children}
    </Tooltip>
  );
});

class VisualizationDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.calculateTimestamps(durationOptions[1]),
      loading: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open && !this.props.open) {
      this.setState(this.calculateTimestamps(durationOptions[1]));
    }
  }

  calculateTimestamps = (duration) => {
    const startDuration = moment()
      .subtract(Number(duration.value.slice(0, -1)), duration.value.slice(-1))
      .startOf("m")
      .valueOf();
    const endDuration = moment().startOf("m").valueOf();
    return {
      selectedDuration: duration,
      startDuration,
      endDuration,
      startInterval: startDuration,
      endInterval: endDuration,
    };
  };

  handleDurationChange = (duration) => {
    this.setState(this.calculateTimestamps(duration));
  };

  handleIntervalChange = (e, interval) => {
    this.setState({
      startInterval: interval[0],
      endInterval: interval[1],
    });
  };

  render() {
    const {
      selectedDuration,
      startDuration,
      endDuration,
      startInterval,
      endInterval,
    } = this.state;
    const { open, loading, title, footer, children, handleClose, classes } =
      this.props;
    const isFunction = typeof children === "function";

    return (
      <Dialog
        aria-labelledby="customized-dialog-title"
        classes={{ paper: classes.dialog }}
        onClose={handleClose}
        open={open}
      >
        {title && (
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            {title}
          </DialogTitle>
        )}
        <DialogContent>
          <div className={classes.timeControls}>
            <Select
              isDisabled={loading}
              value={selectedDuration}
              options={durationOptions}
              onChange={this.handleDurationChange}
            />
            <Slider
              min={startDuration}
              max={endDuration}
              value={[startInterval, endInterval]}
              onChange={this.handleIntervalChange}
              valueLabelDisplay="auto"
              ValueLabelComponent={ValueLabel}
            />
          </div>
          {children && (
            <div className={classes.dialogChildren}>
              {isFunction
                ? children(this.state)
                : children && React.cloneElement(children, this.state)}
            </div>
          )}
        </DialogContent>
        {footer && <DialogActions>{footer}</DialogActions>}
      </Dialog>
    );
  }
}

export default withStyles(styles)(VisualizationDialog);
