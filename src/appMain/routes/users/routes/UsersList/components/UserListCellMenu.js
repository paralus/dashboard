import React, { useState, createRef } from "react";
import { useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import RafayConfirmIconAction from "components/RafayConfirmIconAction";
import { downloadKubeConfig } from "actions/index";
import { downloadFile } from "utils";

const UserListCellMenu = ({
  data,
  handleToggleActive,
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

  const onDownloadKubeConfig = () => {
    handleClose();
    const fileName = `${data?.metadata?.name}-kubeConfig`;
    downloadKubeConfig(data?.metadata?.id).then((res) => {
      downloadFile(fileName, res?.data, "text/plain", "yaml");
    });
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
        <MenuItem>
          <RafayConfirmIconAction
            icon={
              true ? (
                <NotInterestedIcon style={{ color: "red" }} />
              ) : (
                <CheckCircleOutlineIcon style={{ color: "green" }} />
              )
            }
            action={(_) => handleActionClose(data, handleToggleActive)}
            confirmText={
              <>
                <span className="mr-2">
                  Are you sure you want to {status.toLowerCase()}
                  <b> {data.metadata?.name} </b>?
                </span>
              </>
            }
            tooltip={status}
            labelText={status}
          />
        </MenuItem>
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
        {userRole.isOrgAdmin && (
          <MenuItem onClick={onDownloadKubeConfig} disableRipple>
            <Tooltip title="Download Kubeconfig">
              <IconButton aria-label="edit" className="m-0">
                <CloudDownloadIcon />
              </IconButton>
            </Tooltip>
            Download Kubeconfig
          </MenuItem>
        )}
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
