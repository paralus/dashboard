import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  mutedLabel: {
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#BDBDBD",
  },
  activeLabel: {
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "teal",
    overflowWrap: "break-word",
    maxWidth: "10rem",
  },
  activeOtherLabel: {
    color: "rgb(189, 189, 189)",
    fontSize: "0.75rem",
  },
  projectListContainer: {
    width: "12rem",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  },
  projectExpandedListContainer: {
    width: "auto",
    overflowWrap: "break-word",
  },
}));

const getProjectList = (roles, showExpandedList) => {
  const projectArray = [];

  (roles || []).forEach((e) => {
    if (["ADMIN", "ADMINISTRATOR_READ_ONLY"].includes(e?.role)) {
      projectArray.push("All Projects");
    } else if (e?.project) {
      projectArray.push(e.project);
    }
  });

  if (showExpandedList) {
    return [...new Set(projectArray)].join(", ");
  }

  const uniqueProjectList = [...new Set(projectArray)];

  return {
    baseList: [...uniqueProjectList].splice(0, 2),
    otherList: [...uniqueProjectList].splice(2, uniqueProjectList.length - 1),
  };
};

const ProjectList = ({ roles, handleClick, showExpandedList = false }) => {
  const classes = useStyles();
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    setProjectList(getProjectList(roles, showExpandedList));
  }, [roles]);

  const renderExpandedProjectResult = (
    <div className={classes.projectExpandedListContainer} onClick={handleClick}>
      {!projectList?.length ? (
        <span className={classes.mutedLabel}> No projects </span>
      ) : (
        <span>{projectList}</span>
      )}
    </div>
  );

  const renderProjectResult = (
    <div className={classes.projectListContainer} onClick={handleClick}>
      {!projectList?.baseList?.length ? (
        <span className={classes.mutedLabel}> No projects </span>
      ) : (
        <>
          {projectList?.baseList.map((item, idx) => (
            <span className={classes.activeLabel}>
              {item} {idx !== projectList.baseList.length - 1 && ", "}
            </span>
          ))}
          <span className={classes.activeOtherLabel}>
            {projectList.otherList.length > 0 &&
              ` + ${projectList.otherList?.length} More`}
          </span>
        </>
      )}
    </div>
  );

  return showExpandedList ? renderExpandedProjectResult : renderProjectResult;
};

export default ProjectList;
