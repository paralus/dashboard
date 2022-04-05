import React, { useState } from "react";
import { useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import RafayConfirmIconAction from "components/RafayConfirmIconAction";

const UserListCellMenu = ({
  data,
  handleRevokeKubeconfig,
  handleGoToManageKeys,
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
          <RafayConfirmIconAction
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
      </Menu>
    </>
  );
};

export default UserListCellMenu;
