import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";

// import Button from '@material-ui/core/Button';
import T from "i18n-react";

class RafayCliDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.isDownloadOptionsSucess) {
      this.state.open = true;
      this.setState({ ...this.state });
    } else {
      this.state.open = false;
      this.setState({ ...this.state });
    }
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  handleClose = (event) => {
    this.state.open = false;
    this.setState({ ...this.state });
    this.props.resetCliDownload();
  };

  open = () => {
    this.props.getRafayCliDownloadOptions();
  };

  render() {
    let rafayClidownloadOptions = [];
    if (this.props.rafayClidownloadOptions) {
      rafayClidownloadOptions = this.props.rafayClidownloadOptions;
    }

    return (
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <DialogTitle>
          <T.span text="account.cli_download.dialog.title" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <T.span text="account.cli_download.dialog.message" />
          </DialogContentText>
          <div className="row mt-4">
            <List>
              {rafayClidownloadOptions.map((n) => (
                <a href={n[0]} download={n[3]}>
                  <ListItem key={n[3]} button dense>
                    <ListItemText primary={n[3]} />
                  </ListItem>
                </a>
              ))}
            </List>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default RafayCliDownload;
