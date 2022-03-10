import React, { useState } from "react";

import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import FeaturedPlayListIcon from "@material-ui/icons/FeaturedPlayList";
import DescriptionIcon from "@material-ui/icons/Description";
import DeleteIcon from "@material-ui/icons/Delete";
import { or, propEq } from "ramda";

import RafayConfirmDialog from "components/RafayConfirmDialog";

import { Tooltip, IconButton } from "@material-ui/core";

export default function PodActions({
  pod,
  history,
  match,
  eventClick,
  openLogsModal,
  openDescribeDrawer,
  deletePod,
  userRoles
}) {
  const readOnlyRole = or(
    propEq("namespaceReadOnly", true),
    propEq("projectReadOnly", true)
  )(userRoles);

  const handleEventClick = () => {
    eventClick(pod.pod);
  };

  const handleLogClick = e => {
    openLogsModal(e)(pod);
  };

  const handleDescribeClick = () => {
    openDescribeDrawer({ name: pod.pod, namespace: pod.namespace });
  };

  // const reasonsList = Object.values(pod.containerReasons || {});
  const isRunning = pod.phase === "Running"; // [pod.phase, ...reasonsList].includes("Running");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeletePodClick = () => {
    deletePod(pod);
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <Tooltip title="Events">
        <IconButton aria-label="events" onClick={handleEventClick}>
          <EventAvailableIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Shell &amp; Logs">
        <span>
          <IconButton
            aria-label="shell & logs"
            onClick={handleLogClick}
            disabled={!isRunning}
          >
            <FeaturedPlayListIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Describe">
        <IconButton aria-label="describe" onClick={handleDescribeClick}>
          <DescriptionIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <span>
          <IconButton
            aria-label="delete"
            onClick={() => setOpenDeleteDialog(true)}
            disabled={readOnlyRole}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <RafayConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeletePodClick}
        title="Delete Pod"
        content={
          <p>
            This will delete the pod <b>{pod.pod}</b>, are you sure you want to
            continue?
          </p>
        }
      />
    </>
  );
}
