import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";

class ResourceDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  opendialog = () => {
    if (!this.props.message) {
      return;
    }
    this.state.open = true;
    this.setState({ ...this.state });
  };

  closeDialog = () => {
    this.state.open = false;
    this.setState({ ...this.state });
  };

  render() {
    const color = "teal";

    return (
      <>
        {this.props.button ? (
          <Button color="primary" onClick={this.opendialog}>
            {this.props.name}
          </Button>
        ) : (
          <span onClick={this.opendialog}>{this.props.children}</span>
        )}

        <Dialog
          open={this.state.open || false}
          onClose={this.closeDialog}
          maxWidth="md"
        >
          {this.props.heading && (
            <DialogTitle>
              <div>{this.props.heading}</div>
              {this.props.topRightHeading && (
                <div
                  style={{
                    float: "right",
                    fontSize: "medium",
                    fontWeight: "normal",
                    marginTop: "-30px",
                  }}
                >
                  {this.props.topRightHeading}
                </div>
              )}
            </DialogTitle>
          )}
          <DialogContent>
            <div>
              <div
                style={{
                  border: "1px solid #00000024",
                  padding: "10px",
                  backgroundColor: "whitesmoke",
                  borderRadius: "5px",
                  minWidth: "500px",
                }}
              >
                {this.props.message}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.closeDialog}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default ResourceDialog;
