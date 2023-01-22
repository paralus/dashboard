import React from "react";
import { TableCell, TableRow, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIconComponent from "components/DeleteIconComponent";

const useStyles = makeStyles((theme) => ({
  menuList: {
    whiteSpace: "unset",
    wordBreak: "break-all",
    maxWidth: "20rem",
    // padding: "1rem"
  },
}));

const DataTableRow = ({ rowIndex, data, parseRowData }) => {
  const classes = useStyles();
  const parsedData = parseRowData(data, rowIndex);
  const buttonTextClass = {
    danger: "text-red",
    primary: "text-teal",
  };

  return (
    <TableRow hover key={rowIndex}>
      {parsedData?.map((n, index) => {
        if (n.type === "regular") {
          return (
            <TableCell key={index} className={classes.menuList}>
              {n.value}
            </TableCell>
          );
        }
        if (n.type === "multi") {
          return (
            <TableCell key={index} className={classes.menuList}>
              {n.values.map((r, i) => {
                return <div key={i}>{r}</div>;
              })}
            </TableCell>
          );
        }
        if (n.type === "buttons") {
          return (
            <TableCell key={index}>
              <div className="float-right">
                {n.buttons.map((b, i) => {
                  if (["danger", "danger-icon"].includes(b.type)) {
                    return <DeleteIconComponent key={i} button={b} />;
                  }
                  if (b.type === "edit-icon") {
                    return (
                      <Tooltip key={i} title="Edit">
                        {b.disabled ? (
                          <span></span>
                        ) : (
                          <IconButton
                            key={i}
                            aria-label="edit"
                            disabled={b.disabled}
                            className="m-0"
                            onClick={b.handleClick}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Tooltip>
                    );
                  }
                  if (b.type === "custom") {
                    return <React.Fragment key={i}>{b.custom}</React.Fragment>;
                  }
                  return (
                    <Button
                      key={i}
                      className={`mr-4 bg-white ${
                        b.disabled ? "" : buttonTextClass[b.type]
                      }`}
                      disabled={b.disabled}
                      dense
                      variant="contained"
                      color="default"
                      onClick={b.handleClick}
                    >
                      {b.label}
                    </Button>
                  );
                })}
              </div>
            </TableCell>
          );
        }
        return null;
      })}
    </TableRow>
  );
};

export default DataTableRow;
