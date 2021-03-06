import React, { useState } from "react";
import { useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SettingsIcon from "@material-ui/icons/Settings";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import ConfirmIconAction from "components/ConfirmIconAction";

const UserListCellMenu = ({
  data,
  handleRevokeKubeconfig,
  handleGoToManageKeys,
  handleResetPassword,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { userRole } = useSelector((state) => state?.settings);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClose = (data, action) => {
    handleClose();
    action(data);
  };

  const status = true ? "Deactivate" : "Activate";

  return (
    <>
      <Tooltip title="View More">
        <IconButton
          aria-label="edit"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="demo-customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => handleGoToManageKeys(data.metadata.id)}
          disableRipple
        >
          <Tooltip title="Manage Keys">
            <IconButton aria-label="edit" className="m-0">
              <i className="zmdi zmdi-key" />
            </IconButton>
          </Tooltip>
          Manage Keys
        </MenuItem>
        <MenuItem disableRipple>
          <ConfirmIconAction
            icon={<DesktopAccessDisabledIcon />}
            action={(_) => handleActionClose(data, handleRevokeKubeconfig)}
            confirmText={
              <>
                <span className="mr-2">
                  Are you sure you want to revoke kubectlconfig for{" "}
                  <b>{data.metadata?.name}</b> ?
                </span>
              </>
            }
            tooltip="Revoke Kubeconfig"
            labelText="Revoke Kubeconfig"
          />
        </MenuItem>
        <MenuItem disableRipple>
          <ConfirmIconAction
            icon={<SettingsIcon />}
            action={(_) => handleActionClose(data, handleResetPassword)}
            confirmText={
              <>
                <span className="mr-2">
                  Are you sure you want to reset the password for{" "}
                  <b>{data.metadata?.name}</b> ?
                </span>
              </>
            }
            tooltip="Reset Password"
            labelText="Reset Password"
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserListCellMenu;
