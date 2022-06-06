import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  cell: {
    padding: "1rem",
  },
  lastColumn: {
    textAlign: "right",
  },
}));

const DataTableHead = ({
  columnData,
  order,
  orderBy,
  onRequestSort,
  isSortEnabled,
}) => {
  const classes = useStyles();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {columnData.map((column, index) => (
          <TableCell
            key={index}
            id={column.id}
            className={`${classes.cell} ${
              column.label === "Actions" ? classes.lastColumn : ""
            }`}
          >
            {isSortEnabled && !column.disableSorting ? (
              <TableSortLabel
                active={orderBy && orderBy === column.id}
                disabled={column.disableSorting || false}
                direction={orderBy && orderBy === column.id ? order : "asc"}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default DataTableHead;
