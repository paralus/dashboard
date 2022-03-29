import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import T from "i18n-react";
import CardMenu from "./CardMenu";

class CellMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: undefined,
      menuState: false,
      menuItemsActive: [
        { key: "view_keys", name: "Manage Keys" },
        /*   {key:'download_cli', name:"Download CLI"}, */
        // { key: "change_role", name: "Change Role" },
        // { key: "change_status", name: "Activate" },
        { key: "delete_account", name: "Delete" },
      ],
      menuItemsInactive: [
        { key: "view_keys", name: "Manage Keys" },
        /* {key:'download_cli', name:"Download CLI"}, */
        // { key: "change_role", name: "Change Role" },
        // { key: "change_status", name: "Deactivate" },
        { key: "delete_account", name: "Delete" },
      ],
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.isDeleteUserFailed) {
      this.state.isResponseError = true;
    } else {
      this.state.isResponseError = false;
    }
  }

  getErrorMessage = () => {
    if (!this.props.users.error) {
      return null;
    }
    if (typeof this.props.users.error === "string") {
      return <span id="message-id">{this.props.users.error}</span>;
    }
    return (
      <span id="message-id">
        <ul className="list-group">
          {this.props.users.error.details.map((li, index) => (
            <li
              className="list-group-item"
              key={li}
              style={{
                backgroundColor: "transparent",
                border: "transparent",
              }}
            >
              {li.detail}
            </li>
          ))}
        </ul>
      </span>
    );
  };

  onOptionMenuSelect = (event) => {
    this.setState({ menuState: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = (event) => {
    if (event.target.innerText === "Manage Keys") {
      const { history } = this.props;
      history.push(`${history.location.pathname}/${this.props.userId}/keys`);
    }
    if (event.target.innerText === "Download CLI") {
      const { history } = this.props;
      history.push(`${history.location.pathname}/cli`);
    }
    if (
      event.target.innerText === "Deactivate" ||
      event.target.innerText === "Activate"
    ) {
      this.props.toggleUserStatus(this.props.userId);
    }

    if (event.target.innerText === "Delete") {
      this.setState({ deleteOpen: true });
    }

    if (event.target.innerText === "Change Role") {
      this.props.changeRole(event, this.props.userId);
    }

    if (event.target.innerText === "Reset MFA") {
      this.props.resetUserMFA(this.props.accountId);
    }

    this.setState({ menuState: false });
  };

  handleDeleteUser = (event) => {
    this.setState({ deleteOpen: false });
    this.props.deleteUser(this.props.userId);
  };

  handleRequestCloseWarning = (event) => {
    this.setState({ deleteOpen: false });
  };

  handleResponseErrorClose = (event) => {
    this.props.resetUserDeleteResponse();
  };

  render() {
    const { anchorEl, menuState } = this.state;
    let menuItems = this.state.menuItemsActive;
    if (this.props.userStatus) {
      menuItems = this.state.menuItemsInactive;
    }
    const findResetMfa = menuItems.find((obj) => obj.key === "reset_totp");
    if (this.props.isTotpEnabled && findResetMfa === undefined) {
      menuItems.push({ key: "reset_totp", name: "Reset MFA" });
    }
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
            menuItems={menuItems}
          />
        </div>
        <Dialog
          open={this.state.deleteOpen}
          onClose={this.handleRequestCloseWarning}
        >
          <DialogContent>
            <T.span text="user.delete.dialog.description" />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleRequestCloseWarning}
              id="user_delete_cancel"
            >
              <T.span text="user.delete.dialog.cancel" />
            </Button>
            <Button
              onClick={this.handleDeleteUser}
              color="accent"
              id="user_delete_yes"
            >
              <T.span text="user.delete.dialog.yes" />
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.state.isResponseError}
          onClose={this.handleResponseErrorClose}
          className="mb-3"
          message={this.getErrorMessage()}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleResponseErrorClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default CellMenu;
