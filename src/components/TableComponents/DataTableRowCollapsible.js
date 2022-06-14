import React, { useEffect, useState, useRef } from "react";
import { TableCell, TableRow, Button, Collapse, Box } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIconComponent from "components/DeleteIconComponent";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import usePrevious from "utils/usePrevious";

const DataTableRowCollapsible = ({
  rowIndex,
  data,
  parseRowData,
  colSpan,
  getCollapsedRow,
}) => {
  const [open, setOpen] = useState(false);
  const parsedData = parseRowData(data, rowIndex);
  const collapsedRow = getCollapsedRow(data, rowIndex);
  const buttonTextClass = {
    danger: "text-red",
    primary: "text-teal",
  };

  const prevData = usePrevious(data);
  useEffect(
    (_) => {
      if (prevData && prevData.name !== data.name) setOpen(false);
    },
    [data]
  );

  return (
    <React.Fragment key={rowIndex}>
      <TableRow hover key={rowIndex}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {parsedData.map((n, index) => {
          if (n.type === "regular") {
            return (
              <TableCell
                key={index}
                onClick={() => n.isExpandable && setOpen(!open)}
              >
                {n.value}
              </TableCell>
            );
          }
          if (n.type === "multi") {
            return (
              <TableCell key={index}>
                {n.values.map((r, ix) => {
                  return <div key={ix}>{r}</div>;
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
                          <IconButton
                            key={i}
                            aria-label="edit"
                            disabled={b.disabled}
                            className="m-0"
                            onClick={b.handleClick}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      );
                    }
                    if (b.type === "custom") {
                      return (
                        <React.Fragment key={i}>{b.custom}</React.Fragment>
                      );
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
      <TableRow key={`${rowIndex}-collapse`}>
        <TableCell style={{ padding: 0 }} colSpan={colSpan}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={0}>{collapsedRow}</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default DataTableRowCollapsible;
