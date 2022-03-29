import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

const useResourceSharingStatus = (data) => {
  if (!data) return "-";
  const [open, setOpen] = useState(false);
  const { currentProject, projects } = useSelector((state) => {
    return {
      currentProject: state?.Projects.currentProject,
      projects: state?.Projects?.projectsList?.results,
    };
  });
  const shareMode = data.shareMode;
  const projects_list = data.projects;
  const isInherited = data.project_id !== currentProject.id;
  const title = !data.hideTitle && (
    <div className="font-weight-bold">Shared with:</div>
  );
  if (isInherited) {
    const owner = projects?.find((p) => p.id === data.project_id);
    return [
      <>
        <div className="font-weight-bold">Inherited from</div>

        <div>
          {owner?.name ? (
            <span>{owner.name}</span>
          ) : (
            <span className="font-italic text-muted">Unknown</span>
          )}
        </div>
      </>,
      isInherited,
    ];
  }
  if (shareMode === "ALL") {
    return [
      <div>
        {title}
        <div>ALL PROJECTS</div>
      </div>,
      isInherited,
    ];
  }
  if (projects_list?.length === 1 && shareMode === "CUSTOM") {
    return ["-", isInherited];
  }
  if (projects_list?.length > 1 && shareMode === "CUSTOM") {
    const getProjectName = (id) => {
      const proj = projects.find((p) => p.id === id);
      return proj?.name || null;
    };
    const newProjects = projects_list
      ?.filter((p) => p.project_id !== currentProject.id)
      .map((p) => getProjectName(p.project_id))
      ?.filter((a) => a); // filtering to remove/ignore deleted projects
    return [
      <>
        <div>
          {title}
          {[...newProjects]?.splice(0, 3).map((p, i) => (
            <div className="pb-1" key={i}>
              {p}
            </div>
          ))}
          {newProjects?.length > 3 && (
            <Button
              color="primary"
              size="small"
              variant="outlined"
              onClick={(_) => setOpen(true)}
            >
              {`View All (${newProjects?.length})`}
            </Button>
          )}
        </div>
        <Dialog
          open={open}
          onClose={(_) => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle style={{ borderBottom: "1px solid lightgrey" }}>
            Shared with Projects :
          </DialogTitle>

          <DialogContent>
            {newProjects?.map((p, i) => (
              <div className="pb-1" key={i}>
                {p}
              </div>
            ))}
          </DialogContent>
          <DialogActions style={{ borderTop: "1px solid lightgrey" }}>
            <Button onClick={(_) => setOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </>,
      isInherited,
    ];
  }
  return ["-", isInherited];
};

export default useResourceSharingStatus;
