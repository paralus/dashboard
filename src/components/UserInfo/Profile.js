import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@material-ui/core";
import ProjectGroupRoles from "components/ProjectGroupRoles";
import ProjectList from "components/ProjectList";
import ProjectRoleMatrix from "components/ProjectRoleMatrix";
import { getUserSessionInfo } from "actions/index";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";

const style = {
  profileContainer: {
    display: "grid",
    gridTemplateColumns: "10% 90%",
    gridRowGap: "1rem",
    padding: "2.5rem",
  },
  dialogAction: {
    borderTop: "1px solid lightgrey",
  },
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
    // this.props.getUserSessionInfo();
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    onRef(undefined);
  }

  open = () => {
    this.props.getUserSessionInfo();
    this.setState({ open: true });
  };

  close = () => {
    this.state.open = false;
    this.setState({ open: false });
  };

  handleClose = (_) => {
    this.setState({ open: false });
  };

  render() {
    const { user } = this.props;
    const { open } = this.state;
    if (!user) return null;

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        maxWidth="md"
        fullWidth
        className="p-0"
      >
        <DialogTitle className="p-4">Profile</DialogTitle>
        <DialogContent className="p-0">
          <hr className="m-0" />
          <div style={style.profileContainer}>
            {!!`${user.spec.firstName}${user.spec.lastName}`.length && (
              <>
                <div>
                  <b>Name</b>
                </div>
                <div className="">{`${user.spec.firstName} ${user.spec.lastName}`}</div>
              </>
            )}
            <div>
              <b>Username</b>
            </div>
            <div className="">{user.metadata.name}</div>
            <div>
              <b>Projects</b>
            </div>
            <div className="">
              <ProjectList roles={user.spec.permissions} showExpandedList />
            </div>
          </div>
          <div>
            <ProjectRoleMatrix roles={user.spec.permissions} />
          </div>
        </DialogContent>
        <DialogActions style={style.dialogAction}>
          <Button onClick={this.handleClose} color="accent" className="mt-2">
            <span>Close</span>
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withRouter(
  connect(null, {
    getUserSessionInfo,
  })(Profile)
);
