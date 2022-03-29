import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import CardMenu from "./CardMenu";

const defaultMenuItems = ["Edit", "Delete"];

class CellMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      menuState: false,
      selectedOption: undefined,
      menuItems: defaultMenuItems,
    };
  }

  onOptionMenuSelect = (event) => {
    this.setState({ menuState: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = (event) => {
    this.setState({ selectedOption: event.target.innerText });
    if (event.target.innerText === "Edit") {
      this.props.handleEditLocationClick(this.props.data);
    }
    if (event.target.innerText === "Delete") {
      this.state.open = true;
    }
    this.state.menuState = false;
    this.setState({ ...this.state });
  };

  handleConfirmDeleteClose = (e) => {
    this.state.open = false;
    this.setState({ ...this.state });
  };

  handleDeleteLocation = (e) => {
    this.state.open = false;
    this.props.handleDeleteLocationClick(this.props.data.name);
    this.setState({ ...this.state });
  };

  render() {
    const { anchorEl, menuState } = this.state;
    return (
      <div>
        <div className="text-right">
          <IconButton
            className="size-30 p-0"
            onClick={this.onOptionMenuSelect.bind(this)}
          >
            <i className="zmdi zmdi-more-vert" />
          </IconButton>
          <CardMenu
            menuState={menuState}
            anchorEl={anchorEl}
            handleRequestClose={this.handleRequestClose.bind(this)}
            menuItems={this.state.menuItems}
          />
        </div>
        <Dialog
          key="confirm_delete_dialog"
          open={this.state.open}
          onClose={this.handleConfirmDeleteClose}
        >
          <DialogTitle>
            Are you sure you want to delete this location (
            {this.props.data.name}) ?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleConfirmDeleteClose} color="accent">
              Cancel
            </Button>
            <Button onClick={this.handleDeleteLocation} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CellMenu;
