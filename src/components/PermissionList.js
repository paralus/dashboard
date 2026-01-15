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
  permissionListContainer: {
    width: "12rem",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  },
  permissionExpandedListContainer: {
    width: "auto",
    overflowWrap: "break-word",
  },
}));

const getPermissionList = (permissions, showExpandedList) => {
  const permissionArray = [];

  (permissions || []).forEach((e) => {
    permissionArray.push(e);
  });

  if (showExpandedList) {
    return [...new Set(permissionArray)].join(", ");
  }

  const uniquePermissionList = [...new Set(permissionArray)];

  return {
    baseList: [...uniquePermissionList].splice(0, 2),
    otherList: [...uniquePermissionList].splice(
      2,
      uniquePermissionList.length - 1,
    ),
  };
};

const PermissionList = ({
  permissions,
  handleClick,
  showExpandedList = false,
}) => {
  const classes = useStyles();
  const [permissionList, setPermissionList] = useState([]);

  useEffect(() => {
    setPermissionList(getPermissionList(permissions, showExpandedList));
  }, [permissions]);

  const renderExpandedPermissionResult = (
    <div
      className={classes.permissionExpandedListContainer}
      onClick={handleClick}
    >
      {!permissionList?.length ? (
        <span className={classes.mutedLabel}> No permissions </span>
      ) : (
        <span className={classes.activeLabel}>{permissionList}</span>
      )}
    </div>
  );

  const renderPermissionResult = (
    <div className={classes.permissionListContainer} onClick={handleClick}>
      {!permissionList?.baseList?.length ? (
        <span className={classes.mutedLabel}> No permissions </span>
      ) : (
        <>
          {permissionList?.baseList.map((item, idx) => (
            <span className={classes.activeLabel}>
              {item} {idx !== permissionList.baseList.length - 1 && ", "}
            </span>
          ))}
          <span className={classes.activeOtherLabel}>
            {permissionList.otherList.length > 0 &&
              ` + ${permissionList.otherList?.length} More`}
          </span>
        </>
      )}
    </div>
  );

  return showExpandedList
    ? renderExpandedPermissionResult
    : renderPermissionResult;
};

export default PermissionList;
